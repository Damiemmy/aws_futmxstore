#!/bin/sh
set -e

echo "Waiting for database..."
python -c "
import os, time, sys
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.production')
django.setup()
from django.db import connection
for i in range(30):
    try:
        connection.ensure_connection()
        break
    except Exception:
        time.sleep(1)
else:
    sys.exit('Database unavailable')
"

echo "Running migrations..."
python manage.py migrate --noinput
python manage.py seed_roles
python manage.py seed_academics

echo "Loading initial data (if needed)..."
# python manage.py loaddata data.json || echo "Fixture already loaded or skipped"

echo "Collecting static files..."
python manage.py collectstatic --noinput


exec gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3
