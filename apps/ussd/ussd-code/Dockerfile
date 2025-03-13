FROM maven:3.6.3 as maven
LABEL COMPANY="Digital Umuganda"
LABEL MAINTAINER="support@digitalumuganda.com"
LABEL APPLICATION="Mbaza USSD chatbot"

WORKDIR /usr/src/app
COPY . /usr/src/app
RUN mvn package 

#FROM tomcat
FROM tomcat:9.0.39
#ARG TOMCAT_FILE_PATH=/docker 
	
#Data & Config - Persistent Mount Point
#ENV APP_DATA_FOLDER=/var/lib/SampleApp
#ENV SAMPLE_APP_CONFIG=${APP_DATA_FOLDER}/config/
	
#ENV CATALINA_OPTS="-Xms1024m -Xmx4096m -XX:MetaspaceSize=512m -	XX:MaxMetaspaceSize=512m -Xss512k"

#Move over the War file from previous build step
#WORKDIR /usr/local/tomcat/webapps/
#COPY --from=maven /usr/src/app/target/*.war /usr/local/tomcat/webapps/
RUN mkdir -p /usr/share/tomcat/webapps2
#COPY ${TOMCAT_FILE_PATH}/* ${CATALINA_HOME}/conf/
RUN ls
#WORKDIR $APP_DATA_FOLDER


EXPOSE 8080
ENTRYPOINT ["catalina.sh", "run"]
RUN mv /usr/local/tomcat/webapps /usr/share/tomcat/webapps2/
RUN mv /usr/local/tomcat/webapps.dist /usr/local/tomcat/webapps
COPY --from=maven /usr/src/app/target/*.war /usr/local/tomcat/webapps/
RUN mv /usr/local/tomcat/webapps/mbazaussd*.war /usr/local/tomcat/webapps/mbazaussd.war 
COPY tomcat-users.xml /usr/local/tomcat/conf/tomcat-users.xml
COPY context.xml /usr/local/tomcat/webapps/manager/META-INF/context.xml

