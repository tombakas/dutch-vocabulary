import yaml

from pathlib import Path

from vocabulary.utils import load_data


ROOT = Path(__file__).parents[1]
CONFIG_FILE = ROOT / Path("config", "config.yml")

with open(CONFIG_FILE) as f:
    config = yaml.load(f, Loader=yaml.FullLoader)


books = {}
for book in config["books"]:
    books[book] = load_data(ROOT / config["books"][book]["path"])
