from flask import Blueprint
from flask import render_template
from flask import request

from vocabulary.utils import (
    load_data,
    extract_single_chapter,
    combine_all_chapters,
    get_flashcards
)
from vocabulary.constants import COUNTS


routes = Blueprint('routes', __name__,
                   template_folder='templates')

data = load_data()
chapters = sorted(
    data.keys(),
    key=lambda x: int(x.split("_")[1])
) + ["all"]


def chapter_list(section):
    return render_template(
        "choose_chapter.html",
        chapters=chapters,
        section=section
    )


@routes.route('/')
def home():
    return render_template("index.html")


@routes.route('/flashcards')
@routes.route('/practice')
def chapter_choice():
    if "flashcards" in request.path:
        return chapter_list("flashcards")
    return chapter_list("practice")


@routes.route('/flashcards/<string:chapter>')
def count_choice(chapter):
    return render_template(
        "choose_count.html",
        chapter=chapter,
        counts=COUNTS
    )


@routes.route('/flashcards/<string:chapter>/<string:count>')
def flashcards(chapter, count):
    flashcards = get_flashcards(chapter, count, data)
    return render_template(
        "flashcards.html",
        flashcards=flashcards
    )


@routes.route('/practice/<string:chapter>/')
def practice(chapter):
    if chapter == "all":
        entries = combine_all_chapters(data)
    else:
        entries = extract_single_chapter(data, chapter)

    if entries is None:
        return render_template("nope.html")
    return render_template(
        "practice.html",
        entries=entries
    )
