# SkillHub Setup Guide

This guide walks you through setting up the **SkillHub** full-stack development environment locally.

---

## 1. Prerequisites

- **Python**: 3.12+ (or 3.14)
- **Node.js**: 20+ (v24 supported) and `npm`
- **PostgreSQL**: Installed and running locally on port `5432`

---

## 2. PostgreSQL Setup

Ensure a database named `skillhub` exists on your local PostgreSQL server:

```sql
CREATE DATABASE skillhub;
```

---

## 3. Backend Setup

1. Open your terminal and navigate to `backend/`:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   - **Windows (PowerShell)**:
     ```powershell
     python -m venv .venv
     .venv\Scripts\Activate.ps1
     ```
   - **macOS / Linux**:
     ```bash
     python3 -m venv .venv
     source .venv/bin/activate
     ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure `.env` in `backend/`:
   Create `backend/.env` with your local credentials:
   ```env
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   DB_NAME=skillhub
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_HOST=localhost
   DB_PORT=5432
   ```

5. Run migrations:
   ```bash
   python manage.py migrate
   ```

6. (Optional) Create a superuser to access Django Admin:
   ```bash
   python manage.py createsuperuser
   ```

7. Run tests to verify the backend:
   ```bash
   python manage.py test projects
   ```

8. Start the Django development server:
   ```bash
   python manage.py runserver
   ```
   API runs at `http://127.0.0.1:8000/api/` and Admin at `http://127.0.0.1:8000/admin/`.

---

## 4. Frontend Setup

1. Open a new terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure `.env` in `frontend/`:
   Create `frontend/.env`:
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000/api
   ```

4. Verify production build:
   ```bash
   npm run build
   ```

5. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The web app will run at `http://localhost:5173`.
