#!/bin/bash

function cleantext(){
    cat $1 |sed -z 's/\\n/ /g' | sed 's/,/ /g' | sed  -z 's/\\t/ /g'| sed 's/;/ /g' | sed 's/&/,/g'>> $2
    rm $1
}

days=$2
if [ -z "$2" ]; then
   WANTEDTIME=$(date +"%Y-%m-%d" --date="1 days ago")
   echo $WANTEDTIME
else
   WANTEDTIME=$(date +"%Y-%m-%d" --date="$days days ago")
    echo $WANTEDTIME
fi
cd /usr/share/projects/risa-stack/deployment/upload_logs/mbaza-access-reports/

if [[ $1 == "staging" ]];
then
    echo "success"
    echo "TIME,MSISDN,INPUT,NEWREQUEST,HTTP_METHOD,HTTP_RESPONSE,IP_SOURCE,LANGUAGE,UNIQ_SESSION_ID,TYPE_OF_CONTENT,CONTENT" > access_log_staging.$WANTEDTIME.csv
    docker exec -it zammad-docker_zammad-postgresql_1 psql -d mbaza -U zammad -w -c "copy(SELECT to_char(date_time,'DD/Mon/YYYY:HH24:MI:SS'),msisdn, input_choice, status, http_method, http_response, ip_address, language, uniq_session_id, type_of_content, content FROM mbaza_ussd_db.ussdlogging where date_time::date = date '$WANTEDTIME' and msisdn != '0788683008' order by date_time asc) to stdout delimiter '&'" >tmp.txt
    cleantext tmp.txt access_log_staging.$WANTEDTIME.csv
    git add .
    git commit -m "$WANTEDTIME update"
    git push origin staging
elif [[ $1 == "master" ]]
then
    echo "TIME,MSISDN,INPUT,NEWREQUEST,HTTP_METHOD,HTTP_RESPONSE,IP_SOURCE,LANGUAGE,UNIQ_SESSION_ID,TYPE_OF_CONTENT,CONTENT" > access_log_production.$WANTEDTIME.csv
    docker exec -it zammad-docker_zammad-postgresql_1 psql -d mbaza -U zammad -w -c "copy(SELECT to_char(date_time,'DD/Mon/YYYY:HH24:MI:SS'),msisdn, input_choice, status, http_method, http_response, ip_address, language, uniq_session_id, type_of_content, content FROM mbaza_ussd_db.ussdlogging where date_time::date = date '$WANTEDTIME' and msisdn != '0788683008' order by date_time asc) to stdout delimiter '&'" >tmp.txt
    cleantext tmp.txt access_log_production.$WANTEDTIME.csv
    git add .
    git commit -m "$WANTEDTIME update"
    git push origin master
elif [[ $1 == "production" ]]
then
    echo "TIME,MSISDN,INPUT,NEWREQUEST,HTTP_METHOD,HTTP_RESPONSE,IP_SOURCE,LANGUAGE,UNIQ_SESSION_ID,TYPE_OF_CONTENT,CONTENT" > access_log_production.$WANTEDTIME.csv
    docker exec -it zammad-docker_zammad-postgresql_1 psql -d mbaza -U zammad -w -c "copy(SELECT to_char(date_time,'DD/Mon/YYYY:HH24:MI:SS'),msisdn, input_choice, status, http_method, http_response, ip_address, language, uniq_session_id, type_of_content, content FROM mbaza_ussd_db.ussdlogging where date_time::date = date '$WANTEDTIME' and msisdn != '0788683008' order by date_time asc) to stdout delimiter '&'" >tmp.txt
    cleantext tmp.txt access_log_production.$WANTEDTIME.csv
    git add .
    git commit -m "$WANTEDTIME update"
    git push origin master
elif [[ $1 == "development" ]]
then
    echo "TIME,MSISDN,INPUT,NEWREQUEST,HTTP_METHOD,HTTP_RESPONSE,IP_SOURCE,LANGUAGE,UNIQ_SESSION_ID,TYPE_OF_CONTENT,CONTENT" > access_log_development.$WANTEDTIME.csv
    docker exec -it zammad-docker_zammad-postgresql_1 psql -d mbaza -U zammad -w -c "copy(SELECT to_char(date_time,'DD/Mon/YYYY:HH24:MI:SS'),msisdn, input_choice, status, http_method, http_response, ip_address, language, uniq_session_id, type_of_content, content FROM mbaza_ussd_db.ussdlogging where date_time::date = date '$WANTEDTIME' and msisdn != '0788683008' order by date_time asc) to stdout delimiter '&'" >tmp.txt
    cleantext tmp.txt access_log_development.$WANTEDTIME.csv
    git add .
    git commit -m "$WANTEDTIME update"
    git push origin development
else
    echo "development"
    #git push origin development
fi

if [[ $? -ne 0 ]]; then
    echo "update failed"
    exit 1
else
    echo "update complete"
fi

exit 0