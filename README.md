# Dev Docker setup

## 1. Create manully external volumes and networks:
    docker network create infrastructure_default
    docker volume create certs
    docker volume create esdata01
    docker volume create kibanadata
    docker volume create kibanaconfig

## 2. Run docker-compose up with profiles for specific services

### Profiles based on relevant application and functionality.
**docker-compose --profile ussd up**  - Starts all necessary services for running ussd application

**docker-compose --profile ivr up** - Starts all necessary service for runnind IVR application

**docker-compose --profile chat up**- Starts all necessary service for running conversational chat application

**docker-compose --profile voicechat up** - Starts all necessary service for runnind conversational voice chat application


### Profiles alternative servicies
**docker-compose --profile ussd-custom** - Starts custom ussd backend service and frontend application

### Profiles for infrastructure optional services

**docker-compose --profile logs up** - Starts Logstash and Kibana services for ElasticSearch

### Profiles for other optional frontend services
**docker-compose --profile bakame-widget up** - Starts Bakame Widget Frontend Application

**docker-compose --profile rasa-widget up** - Starts Rasa Widget Frontend Application

**docker-compose --profile zammad-form up** - Starts Zammad Form Frontend Application


## 3. Running multiple profiles at once
Ex: docker-compose --profile chat --profile voicechat up



## 4. Resources Usage on Local

### USSD
Container CPU usage
2.30% / 1600%
16 CPUs available

Container memory usage
10.19GB / 15.15GB

### IVR
Container CPU usage
7.03% / 1600%
16 CPUs available

Container memory usage
13.13GB / 15.15GB

### Chat
Container CPU usage
5.25% / 1600%
16 CPUs available

Container memory usage
12.06GB / 15.15GB

### VoiceChat
Container CPU usage
5.58% / 1600%
16 CPUs available

Container memory usage
13.12GB / 15.15GB
