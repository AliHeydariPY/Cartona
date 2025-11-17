# 🛒 Cartona – Online Store Project

## 📌 Introduction
Cartona is a **modern online store** built with **Django 5.2.4** and **Django REST Framework** for the backend, and **React + TailwindCSS** for the frontend.  
It includes user management, vendors, products, shopping cart, payments, comments, categories, favorites, chat, and collections.  

Key backend features:
- **JWT Authentication** for secure login.
- **Celery** and **RQ Scheduler** for background and scheduled tasks.
- **MySQL** database.

Key frontend features:
- Fully responsive pages.
- Dynamic product and collection management.
- Smooth UI interactions with **framer-motion** and **react-virtuoso** for lists.
- State management via **Jotai** and forms with **Formik + Yup**.

---

## 📂 Project Structure
```
### Backend (Django)

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

### Frontend (React)

client/                 # Frontend root
    public/                 # Static files
    src/
    api/                 # Authentication, JWT handling, and backend API calls
    atoms/                 # Reusable small UI units 
    components/                 # Shared UI components across pages
    pages/                 # Page-level components 
    services/                 # All API calls to backend 
    utils/                 # Helper functions and utilities
    validations/                 # Form validation schemas 

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

### Backend (`requirements.txt`)
- Django, Django REST Framework (DRF)  
- djangorestframework-simplejwt (JWT Auth)  
- django-filter  
- django-rq, celery, redis  
- mysqlclient  
- pillow  
- Development tools: django-extensions, ipython  
- Scheduling: rq-scheduler, python-crontab, croniter  

### Frontend (`package.json`)
- react, react-dom  
- react-router-dom  
- axios  
- jotai  
- formik, yup  
- tailwindcss, @tailwindcss/vite  
- @heroicons/react, react-icons  
- framer-motion  
- react-hot-toast  
- react-portal  
- react-range  
- react-textarea-autosize  
- react-virtuoso, react-window, react-virtualized-auto-sizer  
- emoji-picker-react

---

## 🖥️ System Requirements
To run the project, the following must be installed on your system:  

### Backend
- ✅ Python 3.12+ and pip  
- ✅ MySQL Server (database)  
- ✅ Redis Server (for Celery and RQ)  
- ✅ OpenSSL (for SSL certificate generation)  
- ✅ virtualenv/venv (recommended for isolated environments)  
- ✅ Supervisor/systemd or direct script execution for managing services  
- 🔄 Optional: Docker for containerization, Git for source control  

### Frontend
- ✅ Node.js 18+ and npm/yarn  
- ✅ Vite (bundler, already in package.json)  
- ✅ OpenSSL (to generate local HTTPS key and certificate)  

---

## 🚀 Running the Project

### Backend Setup

1. **Startup Scripts**
- Linux: `startcode.sh`  
- Windows: `startcode1.bat`  

Run the corresponding script to prepare and run the backend. These scripts perform the following steps automatically:  
- Install Python dependencies: `pip install -r requirements.txt`  
- Create and apply database migrations: `python manage.py makemigrations / migrate`  
- Collect static files: `python manage.py collectstatic --noinput`  
- Seed predefined categories, products, and collections into the database  
- Generate local SSL certificate for HTTPS (for backend, if needed)  
- Start Django server with SSL: `python manage.py runserver_plus`  
- Start RQ Scheduler for periodic jobs: `python manage.py rqscheduler`  
- Start RQ Workers: `python manage.py rqworker default scheduled`  
- Start Celery Worker for async tasks: `celery -A store worker --loglevel=info`  

---

### Frontend Setup

1. **Navigate to frontend folder**
   ```bash
   cd client
    npm install 
    openssl req -x509 -newkey rsa:4096 -keyout localhost.key -out localhost.crt -days 365 -nodes -subj "/CN=localhost"
    npm run dev
    ```

The frontend will now run on `https://localhost:5173` using the generated localhost.key and localhost.crt files for HTTPS.
