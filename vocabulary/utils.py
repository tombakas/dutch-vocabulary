import csv

from collections import defaultdict

from vocabulary.constants import PATH_TO_VOCAB


def load_data():
    with open(PATH_TO_VOCAB) as f:
        reader = csv.reader(f, delimiter=";")
        dictionary = defaultdict(list)
        for line in reader:
            dictionary["chapter_{}".format(line[2])].append(line[0:2])
        return dictionary
