import json
from bs4 import BeautifulSoup
import requests
import os


MY_ENV_VAR = os.getenv("MY_ENV_VAR")


class KBAbstractionLayer:
    def __init__(self, user_intent, user_entities):
        self.url = MY_ENV_VAR+'/en/{}'.format(user_intent)
        self.user_intent = user_intent
        self.payload = json.loads(user_entities)
        self.kba_response = "Sorry I couldn't help you 😞 What else can I help you with?"
        self.send_request()

    def send_request(self):

        response = requests.post(self.url, json={"entities": self.payload})

        if response.status_code != 204:
            self.kba_response = self.beautify_response(response.text)

    def beautify_response(self, response):

        soup = BeautifulSoup(response, "html.parser")
        return soup.get_text(" ")
