FROM eclipse-temurin:17-jdk-focal
 
WORKDIR /app
 
COPY ussd-code/.mvn/ .mvn
COPY ussd-code/mvnw pom.xml ./
RUN ./mvnw dependency:go-offline
 
COPY ussd-code/src ./src
 
RUN mvn spring-boot:build-image

CMD ["./mvnw", "spring-boot:build"]


FROM tomcat

#RUN mv /usr/local/tomcat/webapps.dist /usr/local/tomcat/webapps
#ADD mbazaussd.war /usr/local/tomcat/webapps/
RUN mkdir -p /usr/share/tomcat/webapps2

EXPOSE 8089

#CMD ["/usr/local/tomcat/catalina.sh", "run"]
CMD ["catalina.sh", "run"]
#RUN mkdir usr/share/tomcat/webapps2
RUN mv /usr/local/tomcat/webapps /usr/share/tomcat/webapps2/
RUN mv /usr/local/tomcat/webapps.dist /usr/local/tomcat/webapps