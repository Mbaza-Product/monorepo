#!/bin/bash

echo "Starting to pull content from zammad"
python3 pull_zammad_kb_script.py
if [ $? -eq 0 ]; then
    echo "Zammad Knowledge base pull succeded"
else
    echo "Zammad pull failed"
fi

FILE=./knowledge_base.txt

if [[ -f "$FILE" ]]; then
    cp $FILE /usr/share/backup/knowledge_base-$(date +%y-%m-%d-%H.%M.%S).txt
    echo "Pushing content to USSD db"
    python3 push_to_ussd_postgres_db_script.py
    if [ $? -eq 0 ]; then
        echo "Push to Db succeded"
        echo "Middleware application succeded"
    else
        echo "Push to Db failed"
    fi
    
else
    echo "Knowledge_base.txt file not found"
    echo "Middleware application failed"
fi

