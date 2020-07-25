#!/usr/bin/env python

from flask import Flask

from vocabulary.routes import routes
from vocabulary.assets import assets


app = Flask(__name__)
app.register_blueprint(routes)

assets.init_app(app)

if __name__ == "__main__":
    app.run()
