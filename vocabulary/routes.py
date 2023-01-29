from flask import Blueprint
from flask import render_template
from flask import request

from vocabulary.utils import (
    extract_single_chapter,
    combine_all_chapters,
    get_chapters,
    get_flashcards
)
from vocabulary.constants import COUNTS
from vocabulary import books


routes = Blueprint('routes', __name__,
                   template_folder='templates')


def chapter_list(book, section):
    return render_template(
        "choose_chapter.html",
        chapters=get_chapters(books[book]),
        section=section
    )


@routes.route('/')
def home():
    return render_template("index.html", books=books.keys())


@routes.route('/<string:book>/')
def book_root(book):
    return render_template("book_root.html")


@routes.route('/<string:book>/flashcards')
@routes.route('/<string:book>/practice')
def chapter_choice(book):
    if "flashcards" in request.path:
        return chapter_list(book, "flashcards")
    return chapter_list(book, "practice")


@routes.route('/<string:book>/flashcards/<string:chapter>/')
def count_choice(book, chapter):
    return render_template(
        "choose_count.html",
        chapter=chapter,
        counts=COUNTS
    )


@routes.route('/<string:book>/flashcards/<string:chapter>/<string:count>')
def flashcards(book, chapter, count):
    flashcards = get_flashcards(chapter, count, books[book])
    return render_template(
        "flashcards.html",
        flashcards=flashcards
    )


@routes.route('/<string:book>/practice/<string:chapter>/')
def practice(book, chapter):
    if chapter == "all":
        entries = combine_all_chapters(books[book])
    else:
        entries = extract_single_chapter(books[book], chapter)

    if entries is None:
        return render_template("nope.html")
    return render_template(
        "practice.html",
        entries=entries
    )
