from pathlib import Path

ROOT_DIR = Path(__file__).parents[1]
DATA_DIR = Path(ROOT_DIR, Path("vocabulary", "data"))
VOCABULARY_FILE = "words.csv"
PATH_TO_VOCAB = Path(DATA_DIR, VOCABULARY_FILE)

COUNTS = [1, 5, 10, 20, 50, "all"]
