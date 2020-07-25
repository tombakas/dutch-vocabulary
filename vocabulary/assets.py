from flask_assets import Environment, Bundle

assets = Environment()

css = Bundle(
    "scss/style.scss",
    filters='libsass, cssmin',
    output='css/style.css',
    depends='**/*.scss'
)

assets.register("css", css)
