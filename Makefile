VENV = .venv
BIN = $(VENV)/bin
PIP = $(BIN)/pip
PYTHON = $(BIN)/python
FLASK = $(BIN)/flask

.PHONY: run
run: $(FLASK)
	FLASK_DEBUG=1 $(PYTHON) ./app.py

$(FLASK): $(VENV)
	$(PIP) install -r config/requirements.txt

$(VENV):
	virtualenv -p python3 $(VENV)
