import sys
import os
import logging
import psycopg2 as psycopg
from decouple import config
import os.path
from os import path


#logging.basicConfig(filename=os.getcwd() +'/app_middleware.log', filemode='a+', format='%(asctime)s - %(levelname)s - %(message)s',datefmt='%d-%b-%y %H:%M:%S',level=logging.DEBUG)
logging.basicConfig(format='%(asctime)s - %(levelname)s - %(message)s',datefmt='%d-%b-%y %H:%M:%S',level=logging.DEBUG)

def connect_to_zammad_db(host="ussd-database", port=5432, dbname='mbaza_ussd', dbuser="mbaza_ussd", password='mbazapassword', schema= 'public'):
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

def push_to_ussd_database(connection):
    
    
    cursor = connection.cursor()

    # truncate the knowledge base table
    sql_select_query = "truncate knowledge_base cascade"
    cursor.execute(sql_select_query)
    #cursor.connection.commit()
    logging.info("Record Truncated sucessfully")

    # Update entire table
    #sql_update_query = """copy knowledge_base from '/usr/share/data/knowledge_base.txt'"""
    with open ('{0}/knowledge_base.txt'.format(os.getcwd()), 'r') as f:
         cursor.copy_from(f, 'mbaza_ussd_db.knowledge_base', sep='\t')
         cursor.connection.commit()
         logging.info("Record Updated successfully ")


def main():
    # connect to DB
    logging.info("***Starting the process of pushing content into the db***")
    connection = connect_to_zammad_db(host=config('USSD_HOST'), port=config('USSD_PORT'), dbname=config('USSD_DATABASE'), dbuser=config('USSD_USER'), password=config('USSD_PASSWORD'))
    
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