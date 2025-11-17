# 🛒 Store Project – README

## 📌 Introduction
This project is an **online store** built with **Django 5.2.4** and **Django REST Framework**. It includes user management, vendors, products, shopping cart, payments, comments, and categories.  
The project uses **JWT Authentication** for user login, **Celery** and **RQ Scheduler** for background and scheduled tasks, and **MySQL** as the database.

---

## 📂 Project Structure
```
store/                # Project root (main settings)
    __init__.py
    asgi.py
    celery.py
    schedule.py
    settings.py
    urls.py
    wsgi.py

cart/                 # App for cart and payments
    models.py
    serializers.py
    views.py
    urls.py
    signals.py
    apps.py
    __init__.py

comment/              # App for comments, replies, Q&A, chat, notifications
    models.py
    serializers.py
    views.py
    urls.py
    signals.py
    apps.py
    __init__.py

inner/                # App for products and categories
    models.py
    serializers.py
    views.py
    urls.py
    signals.py
    apps.py
    tasks.py                  # Background tasks (clear expired discounts/offers)
    seed_static_categories.py # Predefined store categories
    __init__.py

user/                 # App for users and vendors
    models.py
    serializers.py
    views.py
    urls.py
    signals.py
    apps.py
    __init__.py

default image/        # Default images
    storekeeper image
    product image
    product images

requirements.txt      # Project dependencies
startcode.sh          # Linux startup script
startcode1.bat        # Windows startup script
```

---

## ⚙️ Core Settings (store)
- **settings.py**  
  - JWT Authentication with refresh tokens and blacklist.  
  - Database: MySQL.  
  - Celery and RQ with Redis.  
  - CORS and CSRF configured for frontend communication.  
  - Installed apps: `cart`, `comment`, `inner`, `user`.

- **urls.py**  
  - App routes: `/`, `/user-api/`, `/cart/`, `/comments/`, `/inner/`.  
  - Authentication routes:  
    - `/api/token/` → Login (JWT).  
    - `/api/token/refresh/` → Get new access token.  
    - `/api/logout/` → Logout.

- **celery.py**  
  - Celery Worker setup for async tasks.

- **schedule.py**  
  - Scheduled tasks management with RQ Scheduler.  
  - Function `schedule_periodic_task` for periodic jobs.

- **__init__.py**  
  - Celery integration with the project.

---

## 🛍️ Apps

### 1. cart
- Manages shopping cart, items, favorites, and payments.  
- Signals to create cart and favorites when a new user is created.  
- Serializers for validation and representation of cart items and payments.  

### 2. comment
- Manages comments, replies, Q&A, chat, and notifications.  
- Signals for handling comment and purchase-related events.  

### 3. inner
- Manages products, images, attributes, FAQ, categories, and collections.  
- **tasks.py** → Automatically clears expired discounts and offers using Celery/RQ.  
- **seed_static_categories.py** → Seeds predefined store categories.  

### 4. user
- Manages users and vendors.  
- Delivery status management (DeliveryStatus).  
- Vendor payments (StorePayment).  
- User activity summary (UserActivitySummary).  
- JWT authentication system (login, refresh token, logout).  

---

## 🖼️ Default Images
- **storekeeper image** → Default vendor image.  
- **product image** → Default product image.  
- **product images** → Default product gallery image.  

---

## 📦 Dependencies
`requirements.txt` includes:  
- Django, DRF, JWT, django-filter, django-rq, celery, redis, mysqlclient, pillow.  
- Development tools: django-extensions, ipython.  
- Scheduling tools: rq-scheduler, python-crontab, croniter.  

---

## 🖥️ System Requirements
To run the project, the following must be installed on your system:  
- ✅ **Python 3.12+** and pip  
- ✅ **MySQL Server** (for database)  
- ✅ **Redis Server** (for Celery and RQ)  
- ✅ **OpenSSL** (for SSL certificate generation)  
- ✅ **virtualenv/venv** (recommended for virtual environments)  
- ✅ **Supervisor/systemd** or direct script execution for managing services  
- 🔄 Optional: **Docker** for containerization, **Git** for source control, **Node.js** for frontend  

---

## 🚀 Running the Project

### Startup Scripts
Two startup scripts are provided:  
- **Linux:** `startcode.sh`  
- **Windows:** `startcode1.bat`  

Both scripts perform the same sequence of operations to prepare and run the project.

### Explanation of Run Commands
The scripts execute the following steps:

- **pip install -r requirements.txt** → Installs all Python dependencies.  
- **python manage.py makemigrations / migrate** → Creates and applies database migrations.  
- **python manage.py collectstatic --noinput** → Collects static files into the `staticfiles` directory.  
- **python manage.py shell ...** → Seeds predefined categories, products, and collections into the database.  
- **openssl req ...** → Generates a local SSL certificate for HTTPS.  
- **python manage.py runserver_plus** → Starts the Django server with SSL enabled.  
- **python manage.py rqscheduler** → Starts the RQ Scheduler to manage periodic jobs.  
- **python manage.py rqworker default scheduled** → Starts RQ Workers for the `default` and `scheduled` queues.  
- **celery -A store worker --loglevel=info** → Starts the Celery Worker for asynchronous tasks.
