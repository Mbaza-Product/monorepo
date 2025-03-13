import sys
import os
import logging
import psycopg2 as psycopg
from decouple import config
import os.path
from os import path
import csv


#logging.basicConfig(filename=os.getcwd() +'/app_middleware.log', filemode='a+', format='%(asctime)s - %(levelname)s - %(message)s',datefmt='%d-%b-%y %H:%M:%S',level=logging.DEBUG)
logging.basicConfig(format='%(asctime)s - %(levelname)s - %(message)s',datefmt='%d-%b-%y %H:%M:%S',level=logging.DEBUG)

def connect_to_ussd_db(host="ussd-database", port=5432, dbname='mbaza_ussd', dbuser="mbaza_ussd", password='mbazapassword', schema= 'public'):
    try:
        #conn = psycopg.connect("dbname=zammad_production user=zammad host=127.0.0.1 password=zammad")
        conn = psycopg.connect(dbname=dbname, user=dbuser, host=host, password=password, port=port, options= "-c search_path={0}".format(schema))
    except psycopg.OperationalError as e:
        logging.error(e)
        return
    logging.info("Connected to the DB")
    return conn

def close_db_connection(connection):
    logging.info("Closing connection, GOODBYE")
    connection.close()
def return_boolean(string_variable):
    if string_variable== '1':
       return True
    return False

def push_to_ussd_database(connection):
    
    
    cursor = connection.cursor()

    # truncate the knowledge base table
    sql_select_query = "truncate knowledge_base cascade"
    cursor.execute(sql_select_query)
    #cursor.connection.commit()
    logging.info("Record Truncated sucessfully")

    # Update entire table
    #sql_update_query = """copy knowledge_base from '/usr/share/data/knowledge_base.txt'"""
    try:
        with open ('{0}/knowledge_base.txt'.format(os.getcwd()), 'r') as f:
            reader = csv.reader(f, delimiter='\t')
            for row in reader:
                id_number = int(row[0])
                content = row[1]
                if row[2] == '\\N':
                    parent_id = None
                else:
                    parent_id = int(row[2])
                is_menu = return_boolean(row[3])
                ask_menu = return_boolean(row[4])
                position = int(row[5])
                sql = """INSERT INTO knowledge_base (id,content,parent_id,is_menu,ask_menu,position) VALUES(%s,%s,%s,%s,%s,%s)"""
             
                cursor.execute(sql,(id_number,content,parent_id,is_menu,ask_menu,position))
            cursor.copy_from(f, 'knowledge_base', sep='\t')
            cursor.connection.commit()
        logging.info("Record Updated successfully ")
    except psycopg.OperationalError as e:
        close_db_connection(connection)
        logging.error(e)


def main():
    # connect to DB
    logging.info("***Starting the process of pushing content into the db***")
    connection = connect_to_ussd_db(host=config('USSD_HOST'), port=config('USSD_PORT'), dbname=config('USSD_DATABASE'), dbuser=config('USSD_USER'), password=config('USSD_PASSWORD'))
    
    if connection is None:
        logging.error("Couldn't connect to DB, Exiting...")
        sys.exit()


    if path.exists('{0}/knowledge_base.txt'.format(os.getcwd())):
         push_to_ussd_database(connection)
    else:
        logging.error("Knowledge base file not found, Exiting...")

    # close connection to db
    close_db_connection(connection)

if __name__ == "__main__":
    main()