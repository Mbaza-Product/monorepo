## KBAL (Knowledge Base Abstraction Layer) ##
*Follow the steps to get the application up and running.*

### Prerequisites ###
* Postgress up and running

### Steps for Installation ###
1. clone the project: 
```
$ git clone https://git.risa.gov.rw/risa/risa-gcino-projects/risa-innovation-division-projects/mbaza-chatbot/mbaza-chatbot-rasa-implementation/mbaza-chatbot-rasa-knowledge-base-abstraction-layer.git
```
2. Go to inside the created folder: 
```
$ cd mbaza-chatbot-rasa-knowledge-base-abstraction-layer/
```
3. Install node modules: 
```
$ cd npm install
```
4. Create an .env file and past the following: 
```
$ touch .env
```
add this
```yaml
INTENT_DB_HOST=[host-of-intent-database]
INTENT_DB_PORT=5432
INTENT_DB_USERNAME=[username-of-intent-database]
INTENT_DB_PASSWORD=[password-of-intent-database]
INTENT_DB_NANE=[name-of-intent-database]
ZAMMAD_DB_HOST=[host-of-zammad-database]
ZAMMAD_DB_PORT=5432
ZAMMAD_DB_USERNAME=[username-of-zammad-database]
ZAMMAD_DB_PASSWORD=[password-of-zammad-database]
ZAMMAD_DB_NAME=[name-of-zammad-database]
PORT=3000
MODE=DEV
RUN_MIGRATIONS=true
DEFAULT_LOCATION=rwanda
```
5. Done! 
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


## For better developer experience, run the server with nodemon by typing: 
```
$ npm run dev
```

# To Do
- [ ] Connect kba to sonarqube
- [ ] Get badges from sonarQube 
- [ ] Deploy badge to readme 
- [ ] Scan for vulnerabilities and add badge for CVE
- [ ] Deploy to DockerHub
