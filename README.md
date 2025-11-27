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

## 🖥️ 1. Virtual Environment Setup (Backend)

Before running the backend, you must create and activate a Python virtual environment.

### Create Virtual Environment

#### **Windows**
```bash
python -m venv .venv  
.venv\Scripts\activate
```

#### **Linux / macOS**
```bash
python3 -m venv .venv  
source .venv/bin/activate
```

### Install Backend Dependencies:
```bash
pip install -r requirements.txt
```

## 🔧 2. Backend Setup

### Run Startup Scripts

#### **Linux**
```bash
./startcode.sh
```

#### **Windows**
```bash
startcode1.bat
```

### Backend Server Information

🌐 **Backend URL:**  https://127.0.0.1:8000/

### ⚠️ Security Confirmation Required
When you open backend URLs for the first time, your browser may warn you about the SSL certificate.

This is safe because it's your **local development server**.

**Steps:**
1. Click **Advanced**  
2. Select **Proceed to localhost (unsafe)**  
3. Confirm the security exception

---

## ⚡ 3. Frontend Setup

### Navigate to Frontend
```bash
cd client  
npm install
```

### Generate SSL Certificates (for HTTPS)
```bash
openssl req -x509 -newkey rsa:4096 -keyout localhost.key -out localhost.crt -days 365 -nodes -subj "/CN=localhost"
```

### Start Development Server
```bash
npm run dev
```

### Frontend Server Information
🌐 **Frontend URL:** https://localhost:5173

⚠️ **Security Confirmation Required**
Because the certificates are self-signed, the browser will show a warning.

**Steps:**
1. Click **Advanced**  
2. Select **Proceed to localhost (unsafe)**  
3. Confirm the security exception

## ✅ 4. Final Access Points

- **Backend API:** https://127.0.0.1:8000/  
- **Frontend App:** https://localhost:5173/  

⚠️ **Note:** Both frontend and backend use HTTPS in development.  
You must confirm the security exception the first time your browser loads them.

