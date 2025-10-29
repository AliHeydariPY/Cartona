@echo off
echo 🔧 Installing dependencies...
pip install -r requirements.txt

echo 📦 Making migrations...
python manage.py makemigrations

echo 🚀 Applying migrations...
python manage.py migrate

echo 🖼️ Collecting static files...
python manage.py collectstatic --noinput

echo 🐍 Seeding static categories via shell...
echo from inner.seed_static_categories import seed_static_categories > temp_seed.py
echo seed_static_categories() >> temp_seed.py

python manage.py shell < temp_seed.py
del temp_seed.py

echo 🔐 Generating SSL certificate...
openssl req -x509 -newkey rsa:4096 -keyout localhost.key -out localhost.crt -days 365 -nodes -subj "/CN=localhost"

echo 🌐 Starting server with SSL...
python manage.py runserver_plus --cert-file localhost.crt --key-file localhost.key

