# from dis import dis
# from fuzzywuzzy import fuzz
# import json


# def location_lookup(location: str) -> bool:
#     filename = "districts.txt"
#     with open(filename) as data:

#         for district in data:
#             if district.rstrip() == location:
#                 return True
#         return False


# def get_location_similarity(n1: str, n2: str) -> int:
#     return fuzz.token_sort_ratio(n1, n2)


# def most_similar_location(location: str):
#     filename = "districts.txt"

#     max_similarity = float("-inf")
#     with open(filename) as data:
#         for district in data:
#             district = district.rstrip()
#             similarity = get_location_similarity(district, location)
#             if similarity > max_similarity:
#                 max_similarity = similarity
#                 best_location = district

#     return best_location


# def test():
#     location = "Kigalmm"
#     if location:
#         location = location.capitalize()
#         isPresent = location_lookup(location)

#         if isPresent:
#             message = "KBA"
#         else:
#             intended_location = most_similar_location(location)
#             message = f"Did you mean {intended_location}?"
#             buttons = [
#                 {
#                     "title": "Yes",
#                     "payload": f'/lockdown_areas{{"location":"{intended_location}"}}',
#                 },
#                 {"title": "No", "payload": "/out_of_scope"},
#             ]

#         return message


# print(most_similar_location("Kigaluuu"))
# print(test())
