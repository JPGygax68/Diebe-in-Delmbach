# In case weasyprint is not found, execute the following:

rm -rf .venv
python3 -m venv .venv
.venv/bin/python -m ensurepip --upgrade
.venv/bin/python -m pip install --upgrade pip setuptools wheel
.venv/bin/python -m pip install weasyprint
.venv/bin/weasyprint --version