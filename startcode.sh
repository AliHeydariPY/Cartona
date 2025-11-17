#!/bin/bash

echo "🔧 Installing dependencies..."
pip install -r requirements.txt

echo "📦 Making migrations..."
python manage.py makemigrations

echo "🚀 Applying migrations..."
python manage.py migrate

echo "🖼️ Collecting static files..."
python manage.py collectstatic --noinput

echo "🐍 Seeding static categories, products, and collections via shell..."
python manage.py shell << END
from inner.seed_static_categories import seed_static_categories
from inner.signals import seed_default_products, seed_collections
seed_static_categories()
seed_default_products()
seed_collections()
exit()
END

echo "🔐 Generating SSL certificate..."
openssl req -x509 -newkey rsa:4096 -keyout localhost.key -out localhost.crt -days 365 -nodes -subj "/CN=localhost"

echo "🌐 Starting server with SSL..."
python manage.py runserver_plus --cert-file localhost.crt --key-file localhost.key &

echo "⏰ Starting RQ Scheduler..."
python manage.py rqscheduler &

echo "⚙️ Starting RQ Worker..."
python manage.py rqworker default scheduled &

echo "⚙️ Starting Celery worker..."
celery -A store worker --loglevel=info &
