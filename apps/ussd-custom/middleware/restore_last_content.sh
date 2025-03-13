#!/bin/bash

echo "Restore ussd application to last content starting "
cd /usr/share/backup

# retrieve the last backup
LATEST_BACKUP=$(printf '%s\n' knowledge_base* | sort -rn | head -n1)
echo LATEST_BACKUP
cp $LATEST_BACKUP /usr/share/data/knowledge_base.txt
cd /usr/share/data

#send backup to ussd db
python push_to_ussd_postgres_db_script.py

echo "Restoration complete"