from typing import Dict, Text, Any, Optional
from rasa_sdk import Tracker

from fuzzywuzzy import fuzz
import json


def get_entity_details(
    tracker: Tracker, entity_type: Text
) -> Optional[Dict[Text, Any]]:
    all_entities = tracker.latest_message.get("entities", [])
    entities = [e for e in all_entities if e.get("entity") == entity_type]
    if entities:
        return entities[0]


def get_entities(tracker: Tracker):
    all_entities = tracker.latest_message.get("entities", [])
    return tracker.get_intent_of_latest_message(), json.dumps(all_entities)


def detect_entity(tracker: Tracker, entity_types: Text) -> Optional[Dict[Text, Any]]:
    all_entities = tracker.latest_message.get("entities", [])
    for e in all_entities:
        for e_type in entity_types:
            if e.get("entity") == e_type:
                return e_type


def intent_to_message(intent: str) -> str:
    filename = "actions/intent_description_mapping.json"
    with open(filename) as data:
        intent_mapping = json.load(data)

        for item, message in intent_mapping.items():
            if item == intent:
                return message

    return ""


def location_lookup(location: str) -> bool:
    filename = "actions/districts.txt"
    with open(filename) as data:
        for district in data:
            if district.rstrip() == location:
                return True
        return False


def get_location_similarity(n1: str, n2: str) -> int:
    return fuzz.token_sort_ratio(n1, n2)


def most_similar_location(location: str) -> str:
    filename = "actions/districts.txt"

    max_similarity = float("-inf")
    with open(filename) as data:
        for district in data:
            district = district.rstrip()
            similarity = get_location_similarity(district, location)
            if similarity > max_similarity:
                max_similarity = similarity
                best_location = district

    return best_location
