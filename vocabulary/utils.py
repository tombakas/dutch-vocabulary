import re
import csv

from collections import defaultdict

from random import sample
from random import shuffle

from vocabulary.constants import PATH_TO_VOCAB


def load_data():
    with open(PATH_TO_VOCAB, "rt", encoding="utf-8") as f:
        reader = csv.reader(f, delimiter=";")
        dictionary = defaultdict(lambda: defaultdict(list))
        for line in reader:
            dictionary[
                "chapter_{}".format(line[2])
            ][
                line[1].strip()
            ].extend([item.strip() for item in line[0].split("/")])
        return dictionary


def get_flashcards(chapter, count, data):
    if count == "all":
        if chapter == "all":
            entries = combine_all_chapters(data, sort=False)
        else:
            entries = extract_single_chapter(data, chapter)
        shuffle(entries)
    else:
        entries = sample(
            extract_single_chapter(data, chapter), k=int(count)
        )

    flash_cards = []

    def build_answers(item):
        """
        Normalize potential answers by removing parts in brackets,
        like "(e)" and extra space
        """
        answers = []
        bracket_text = item[item.find("(")+1:item.find(")")]

        item = re.sub("\([\w -]+\)","",item) # noqa
        item = item.strip()

        flash_card["answers"].append(item)
        if "-" in bracket_text:
            flash_card["answers"].append(bracket_text.replace("-", item))
        elif bracket_text == "e":
            flash_card["answers"].append(item + "e")

        # If the word comes with an article, move it in front
        # as one of the answers
        if re.search(",\ ?(de|het)", item): # noqa
            parts = item.split(",")
            item = " ".join([parts[1], parts[0]]).strip()
            answers.append(item)

        return answers

    for entry in entries:
        flash_card = {
            "dutch": " / ".join(entry[1]),
            "english": entry[0],
            "answers": []
        }

        for item in entry[1]:
            if "/" in item:
                for sub_item in item.split("/"):
                    flash_card["answers"].extend(build_answers(sub_item))
            else:
                flash_card["answers"].extend(build_answers(item))

        flash_cards.append(flash_card)
    return flash_cards


def extract_single_chapter(data, chapter):
    return list(data[chapter].items())

def combine_all_chapters(data, sort=True):
    entries = [
        item for sublist in [
            list(i.items()) for i in list(data.values())
        ] for item in sublist]
    if sort:
        return sorted(entries, key=lambda x: x[0].lower())
    return list(entries)
