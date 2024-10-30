#!/bin/sh
python3 manage.py migrate
daphne -p 8080 -b 0.0.0.0 config.asgi:application