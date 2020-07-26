from flask_assets import Environment, Bundle

assets = Environment()

css = Bundle(
    "scss/style.scss",
    filters='libsass, cssmin',
    output='css/style.css',
    depends='**/*.scss'
)

js = Bundle(
    "js/src/flashcards.js", "js/src/js-levenshtein.js",
    # filters="jsmin",
    output='js/bundle.js',
    depends="**/*.js"
)

assets.register("css", css)
assets.register("js", js)
