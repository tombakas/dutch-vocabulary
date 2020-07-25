import re
import csv

from itertools import chain
from collections import defaultdict

from random import sample
from random import shuffle

from vocabulary.constants import PATH_TO_VOCAB


def load_data():
    with open(PATH_TO_VOCAB) as f:
        reader = csv.reader(f, delimiter=";")
        dictionary = defaultdict(list)
        for line in reader:
            dictionary["chapter_{}".format(line[2])].append(line[0:2])
        return dictionary


def get_flashcards(chapter, count, data):
    if count == "all":
        entries = combine_all_chapters(data, sort=False)
        shuffle(entries)
    else:
        entries = sample(data.get(chapter), k=int(count))

    flash_cards = []
    for entry in entries:
        flash_card = {
            "definition": entry[0],
            "translation": entry[1],
            "answers": []
        }

        # Normalize potential answers by removing parts in brackets,
        # like "(e)" and extra space
        for item in entry[0].split("/"):
            item = re.sub("\([a-zA-Z]+\)","",item) # noqa
            item = item.strip()
            flash_card["answers"].append(item)

            # If the word comes with an article, move it in front
            # as one of the answers
            if re.search(",\ ?(de|het)", item): # noqa
                parts = item.split(",")
                item = " ".join([parts[1], parts[0]]).strip()
                flash_card["answers"].append(item)

        flash_cards.append(flash_card)
    return flash_cards

def combine_all_chapters(data, sort=True):
    entries = chain.from_iterable(
        list(data.values())
    )
    if sort:
        return sorted(entries, key=lambda x: x[0].lower())
    return list(entries)
