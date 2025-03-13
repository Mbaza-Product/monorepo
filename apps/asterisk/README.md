## Start asterisk component

Customize AGI server URL enviroment variable (docker-compose.yml)
```
AGI_SERVER: agi://${DOCKER_GATEWAY_HOST:-host.docker.internal}:4573/irv
```

Start asterisk docker
> make run-docker

## Using asterisk component
Initiate call from SIP phone (Telephone on osx):
- Name: Dorin
- Domain: localhost
- User Name: sipuser
- Password: xsecret
Dial: 100

Initiate a call from asterisk console:
```
docker exec -it demo-asterisk_tele_1 bash
rasterisk
console dial 100@phones
```

## Debugging:
ssh to docker
> docker exec -it demo-asterisk_tele_1 bash

watch the log
> tail -f /var/log/asterisk/messages

check on sip messages
```
apt-get update && apt-get install sngrep 
sngrep
```