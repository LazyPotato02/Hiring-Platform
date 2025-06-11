# 📄 Project Documentation: Remote Job Board Platform

## 🧩 Overview
This project is a **Remote Job Board Platform** designed to connect companies with candidates for remote work opportunities. It provides functionalities for job posting, application management, and user authentication.

The system is divided into two main parts:
- **Frontend**: Built with **React + TypeScript** using **Vite**.
- **Backend**: Developed with **Django + Django REST Framework (DRF)**.

## 🚀 Technologies Used

### Frontend:
- React (TypeScript)
- Vite
- CSS Modules
- Axios

### Backend:
- Python 3
- Django
- Django REST Framework (DRF)

## 🔐 Authentication
Authentication is implemented using a custom token-based system (defined in `authentication.py`), integrated in both the frontend and backend.

- Frontend handles login state using React Context.
- Backend exposes endpoints for authentication and token management.

## ✨ Features
- ✅ User registration and login
- ✅ Interview role users can add, edit, and delete job postings
- ✅ Regular users can view and apply for jobs
- ✅ Display posted jobs per user
- ✅ Paginated job listings
- ✅ Clean UI with conditional navigation

## 🧭 Frontend Routing
The application defines the following frontend routes:

- `/` → Home page
- `/jobs` → List all jobs
- `/jobs/:techName` → List jobs by tech stack
- `/jobs/search/:id` → View job details
- `/jobs/add` → Add job (requires interview role)
- `/profile` → User profile page
- `/user/posted-jobs` → View jobs posted by the user
- `/login` → Login page (blocked for logged-in users)
- `/register` → Registration page (blocked for logged-in users)

## 🌐 Backend API Routing

### Main URL Configuration:

- `/admin/` – Django admin panel
- `/users/` – User management routes
- `/company/` – Company-related functionality
- `/job/` – Job listing endpoints
- `/applications/` – Job application actions

### Job Endpoints:

- `/job/` – List or create jobs
- `/job/detail/<id>/` – Job detail view
- `/job/search/<id>/` – Search job by ID
- `/job/tech-categories/` – List tech categories
- `/job/jobs/tech/<tech_stack>/` – List jobs by tech stack
- `/job/my-jobs/<user_id>/` – List jobs posted by a user
- `/job/jobs/` – Global job list

### Job Application Endpoints:

- `/applications/apply/` – Apply to a job
- `/applications/apply/status/<job_id>/` – Application status check

### User Endpoints:

- `/users/me/` – Get current user profile
- `/users/register/` – Register new user
- `/users/login/` – Login user
- `/users/refresh-token/` – Refresh JWT token
- `/users/update-profile/` – Update user profile
- `/users/change-password/` – Change user password
- `/users/logout/` – Logout user

## 🛠️ Running the Project Locally

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd src
npm install
npm run dev
```

## 📦 Next Step: Docker Integration
The next step involves dockerizing the entire project using `Dockerfile` and `docker-compose.yml`, to simplify deployment and ensure consistent environments.

---

Let me know if you need environment variable configuration, deployment setup, or CI/CD integration guidelines.
