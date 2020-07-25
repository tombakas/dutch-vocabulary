from itertools import chain

from flask import Blueprint
from flask import render_template
from flask import request

from vocabulary.utils import load_data
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
    activity = request.path.split("/")[0]
    return render_template(
        "choose_count.html",
        chapter=chapter,
        activity=activity,
        counts=COUNTS
    )


@routes.route('/practice/<string:chapter>/')
def practice(chapter):
    if chapter == "all":
        entries = chain.from_iterable(
            list(data.values())
        )
        entries = sorted(entries, key=lambda x: x[0].lower())
    else:
        entries = data.get(chapter)

    return render_template(
        "practice.html",
        entries=entries
    )
