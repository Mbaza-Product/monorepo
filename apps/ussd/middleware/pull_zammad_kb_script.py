import sys
import os
import logging
import psycopg2 as psycopg
from decouple import config
import re
from bs4 import BeautifulSoup

#logging.basicConfig(filename=os.getcwd() +'/app_middleware.log', filemode='a+', format='%(asctime)s - %(levelname)s - %(message)s',datefmt='%d-%b-%y %H:%M:%S',level=logging.DEBUG)
logging.basicConfig(format='%(asctime)s - %(levelname)s - %(message)s',datefmt='%d-%b-%y %H:%M:%S',level=logging.DEBUG)

def clean_content(body):
    # Method to remove other html folders but replace </div> with \\n
    if(body[-6:]=='</div>'):
        body = body[:-6] # to remove the last </div>
    text = body.replace('<div>','')
    text = text.replace('</div>','\bxa1')
    text = text.replace('<br>', '')
    soup = BeautifulSoup(text,"html.parser")
    text = soup.get_text()
    text = text.replace('\n', '')
    text = text.replace('\bxa1', '\n')
    text = re.sub('\n+$','',text)
    text = re.sub('\n+','@bxa1',text)
    text = text.replace('@bxa1', '\\n')
    return text

def isContentForQuerying(query):
    is_menu = 0
    if ("gusaba kwikingiza"==query.lower() or "vaccination booking"==query.lower() or "demande de se faire vacciner" ==query.lower()):
        logging.info("'{0}' has been selected to be used for vaccination booking".format(query))
        is_menu = 1
    elif("patient's health state registration"==query.lower() or "kwandidkisha uko umurwayi ameze"==query.lower() or "enregistrer l'état de santé du patient"==query.lower()):
        logging.info("'{0}' has been selected to be used for patient's health state registration".format(query))
        is_menu = 1
    elif("check vaccination status"==query.lower() or "kureba niba warikingije"==query.lower() or "vérifiez si je suis vacciné"==query.lower):
        logging.info("'{0}' has been selected to be used for check vaccination status".format(query))
        is_menu = 1
    elif("check covid test result"==query.lower() or "kureba ibisubizo by'ibipimo bya covid"==query.lower() or "vérifier le résultat du test covid"==query.lower()):
        logging.info("'{0}' has been selected to be used for check vaccination status".format(query))
        is_menu = 1
    return is_menu


def get_answer_content(conn, id):
    cursor = conn.cursor()
    cursor.execute("select body from knowledge_base_answer_translation_contents where id= {0}".format(id))
    results = cursor.fetchall()
    text = clean_content(results[0][0])
    return text

def get_answer_info(conn,title_info):
    answers = {}
    for title in title_info:
        answer_id= title_info[title][2]
        text = get_answer_content(conn, answer_id)
        answers[answer_id] = [text,title]
    return answers

def get_category_ids_from_titles(connect):
    cursor = connect.cursor()
    cursor.execute("select category_id from knowledge_base_answers")
    results = cursor.fetchall()
    categories = [item[0] for item in results]
    return categories

def compare_categories(all_categories,categories_with_children):
    return set(all_categories).intersection(categories_with_children)

def get_title_ids(connect, categories_with_children):
    cursor= connect.cursor()
    title_ids={}
    for category in categories_with_children:
       cursor.execute("select id from knowledge_base_answers where category_id= {0}".format(category))
       results = cursor.fetchall()
       for result in results:
          title_ids[result[0]]=category
    return title_ids

def get_titles_info(connect, titles_list, lang_id):
    cursor = connect.cursor()
    title_info={}
    for title_id in titles_list.keys():
        cursor.execute("select title, content_id from knowledge_base_answer_translations where id= {0} and kb_locale_id = {1}".format(title_id, lang_id))
        results = cursor.fetchall()
        for result in results:
            title_info[title_id]= [result[0],titles_list[title_id],result[1]]
    return title_info


def retrieve_answers(connect, title_list, lang_id=3):
    cursor = connect.cursor()
    titles_with_language = {}

    for title in title_list:
        cursor.execute("select id, title from knowledge_base_answer_translations where answer_id = {0} and kb_locale_id = {1}".format(title, lang_id))
        result = cursor.fetchall()
        id = result[0][0]
        title_name =  result[0][1]
        cursor.execute("select position from knowledge_base_answers where id = {0}".format(title))
        position = cursor.fetchall()
        titles_with_language[title] = [title_name, title_list.get(title), id, position[0][0]]
    return titles_with_language

def get_zammad_titles(connect, all_categories, lang_id, category_root_id):
    categories = get_category_ids_from_titles(connect)
    categories_with_children = compare_categories(all_categories.keys(),categories)
    # Does the root category contain an article
    if category_root_id in categories:
      categories_with_children.add(category_root_id)
    titles_list = get_title_ids(connect, categories_with_children)
    #print('titles_list: ', titles_list)
    #all_titles = get_titles_info(connect, titles_list, lang_id)
    all_titles = retrieve_answers(connect, titles_list, lang_id)
    return all_titles

def get_category_children(connect, category):
    cursor = connect.cursor()
    cursor.execute("select id from knowledge_base_categories where parent_id = {0}".format(category))
    results = cursor.fetchall()
    children = [item[0] for item in results]
    return children

def get_category_names(connect, categories, lang):

    children_names = {}
    cursor = connect.cursor()
    for category in categories:
        cursor.execute("select title from knowledge_base_category_translations where category_id = {0} and kb_locale_id={1}".format(category, lang))
        results_name = cursor.fetchall()
        if results_name== []:
           return
        else:
            answer = results_name[0][0]
            cursor.execute("select position from knowledge_base_categories where id = {0} ".format(category))
            result = cursor.fetchall()
            children_names[category]=answer,result[0][0]
    return children_names

def get_zammad_categories(conn, all_categories, category_id=6, lang_id=3):
    '''
    return dict --> format {id, [name, parend_id]}
    '''
    children= get_category_children(conn,category_id)
    if len(children) == 0:
       return
    else:
        children_names=get_category_names(conn,children, lang_id)
        if children_names == None:
            return
        for child in children:
            all_categories[child] = [children_names[child][0], category_id,children_names[child][1]]
            get_zammad_categories(conn, all_categories, child, lang_id)
    return

def assign_new_id_and_save_to_file(all_categories, all_titles, all_answers,lang_id,lang_dict,counter, root_parent=6):
    """ Function to keep zammad content stored in form of a file
        Format: id\tcontent\tis_menu\tis_menu\tas_menu\tposition 
    """
    entire_id={}
    category_id={}
    title_id={}
    answer_id={}
    is_menu = 0
    position_root_articles = 0
    file =  open( os.getcwd() +  "/knowledge_base.txt", "a")
    entire_id[lang_id]=[counter, '\\N']
    if lang_dict.get(lang_id)=="KINYARWANDA":
        file.write("{0}\t{1}\t\\N\t1\t0\t0\n".format(entire_id.get(lang_id)[0],lang_dict.get(lang_id)))
    elif lang_dict.get(lang_id)=="ENGLISH":
        file.write("{0}\t{1}\t\\N\t1\t0\t1\n".format(entire_id.get(lang_id)[0],lang_dict.get(lang_id)))
    else:
         file.write("{0}\t{1}\t\\N\t1\t0\t\\N\n".format(entire_id.get(lang_id)[0],lang_dict.get(lang_id)))
    counter+=1

    for category in all_categories:
        if all_categories.get(category)[1] == root_parent:
            category_id[category]=[counter,entire_id.get(lang_id)[0]]
            is_menu = isContentForQuerying(all_categories.get(category)[0])
            file.write("{0}\t{1}\t{2}\t1\t{3}\t{4}\n".format(category_id.get(category)[0], all_categories.get(category)[0],category_id.get(category)[1],is_menu,all_categories.get(category)[2] ))
            counter+=1
            position_root_articles+=1
    for category in all_categories:
        if all_categories.get(category)[1] != root_parent:
            category_id[category]=[counter,category_id.get(all_categories.get(category)[1])[0]]
            is_menu = isContentForQuerying(all_categories.get(category)[0])
            file.write("{0}\t{1}\t{2}\t1\t{3}\t{4}\n".format(category_id.get(category)[0], all_categories.get(category)[0], category_id.get(category)[1],is_menu,all_categories.get(category)[2]  ))
            counter+=1

    for title in all_titles:
        if all_titles.get(title)[1] == root_parent:
            title_id[title]=[counter,entire_id.get(lang_id)[0]]
            article_position = str(position_root_articles + int (all_titles.get(title)[3]))
            is_menu = isContentForQuerying(all_titles.get(title)[0])
            file.write("{0}\t{1}\t{2}\t1\t{3}\t{4}\n".format(title_id.get(title)[0], all_titles.get(title)[0],title_id.get(title)[1],is_menu, article_position ))
        else:
            title_id[title]=[counter,category_id.get(all_titles.get(title)[1])[0]]
            is_menu = isContentForQuerying(all_titles.get(title)[0])
            file.write("{0}\t{1}\t{2}\t1\t{3}\t{4}\n".format(title_id.get(title)[0], all_titles.get(title)[0],title_id.get(title)[1],is_menu, all_titles.get(title)[3] ))
        counter+=1

    for answer in all_answers:
        answer_id[answer]=[counter,title_id.get(all_answers.get(answer)[1])[0]]
        file.write("{0}\t{1}\t{2}\t0\t0\t0\n".format(answer_id.get(answer)[0], all_answers.get(answer)[0], answer_id.get(answer)[1] ))
        counter+=1

    return counter


def connect_to_zammad_db(host="zammad-postgresql", port=5432, dbname='zammad_production', dbuser="zammad", password='zammad'):
    try:
        #conn = psycopg.connect("dbname=zammad_production user=zammad host=127.0.0.1 password=zammad")
        conn = psycopg.connect(dbname=dbname, user=dbuser, host=host, password=password, port=port)
    except psycopg.OperationalError as e:
        logging.error(e)
        return
    logging.info("Connected to the DB")
    return conn

def close_db_connection(connection):
    logging.info("Closing connection, GOODBYE")
    connection.close()

def main():
    logging.info("Starting the retrieval of information from the zammad knowledge base")
    category_root_id = int (config('ROOT_CATEGORY'))
    KIN = config('KINYARWANDA_ID')
    ENG = config('ENGLISH_ID')
    language_id = [KIN, ENG]
    counter_assign_id=1
    lang_dict={KIN:'KINYARWANDA',ENG:'ENGLISH'}

    connection = connect_to_zammad_db(host=config('ZAMMAD_HOST'), port=config('ZAMMAD_PORT'), dbname=config('ZAMMAD_DATABASE'), dbuser=config('ZAMMAD_USER'), password=config('ZAMMAD_PASSWORD'))
    if connection is None:
        logging.error("Couldn't connect to DB, Exiting...")
        sys.exit()

    open( os.getcwd() + "/knowledge_base.txt", 'w').close()

    for lang in language_id:

        all_categories={}

        all_titles = {}

        all_answers = {}
        get_zammad_categories(connection,all_categories, category_root_id ,lang)
        if all_categories =={}:
           logging.warning("{0}Language containts no content".format(lang_dict.get(lang)))
        else:
           all_titles = get_zammad_titles(connection, all_categories, lang, category_root_id)
           all_answers = get_answer_info(connection,all_titles)
           counter_assign_id= assign_new_id_and_save_to_file(all_categories, all_titles, all_answers,lang,lang_dict,counter_assign_id, category_root_id)


    close_db_connection(connection)

if __name__ == "__main__":
    main()

