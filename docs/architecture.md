# SkillHub Architecture

## High-Level Overview

SkillHub is a full-stack learning roadmapping and portfolio platform designed with clean separation of concerns, strict typing, and automated testing.

```
┌────────────────────────────────────────────────────────┐
│                   React + Vite SPA                     │
│  (Tailwind CSS, React Router, TanStack Query, Axios)   │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP / JSON
                            │ (JWT Bearer Auth)
                            ▼
┌────────────────────────────────────────────────────────┐
│                 Django REST Framework                  │
│       (Django 5.x, SimpleJWT, Python Decouple)         │
└─────────────┬───────────────────────────┬──────────────┘
              │                           │
              ▼                           ▼
┌───────────────────────────┐ ┌──────────────────────────┐
│    PostgreSQL Database    │ │ Redis + Celery (Planned) │
│ (Auth, Projects, Paths)   │ │  (Background ML Tasks)   │
└───────────────────────────┘ └──────────────────────────┘
```

---

## 1. Backend Architecture (`backend/`)

- **Django 5.x & Django REST Framework**:
  - `skillhub/`: Central configuration, URL routing, CORS rules, and decoupled environment variables.
  - `projects/`: Domain model for user portfolios. Includes `Project` entity (`title`, `description`, `owner`, `github_url`, `live_url`, `created_at`).
  - `api/`: Centralized API gateway exposing viewsets, permissions (`IsOwnerOrReadOnly`), and SimpleJWT token routes.
  - `users/`, `paths/`, `progress/`: Scaffolding for upcoming authentication and learning path milestone modules.

### Authentication & Authorization
- Uses `djangorestframework-simplejwt`.
- Read operations are unauthenticated (`AllowAny` / `IsAuthenticatedOrReadOnly`).
- Write/update/delete operations require authentication and ownership verification (`IsOwnerOrReadOnly`).

---

## 2. Frontend Architecture (`frontend/`)

- **Vite + React 18+ & TypeScript**: Fast HMR and type-safety.
- **Tailwind CSS**: Modern dark theme design system.
- **Axios (`services/apiClient.ts`)**: Base HTTP client with request interceptors to automatically attach JWT authorization headers.
- **TanStack Query (React Query)**: Server-state synchronization, automatic caching, re-fetching, and optimistic UI mutations.
- **React Router**: Client-side routing with shared navigation layout (`/`, `/projects`, `/paths`).

---

## 3. DevOps & CI (`.github/workflows/ci.yml`)

- GitHub Actions automated pipeline:
  - **Backend job**: Provisions a temporary PostgreSQL 16 service, installs Python dependencies, runs migrations, and executes test suites.
  - **Frontend job**: Sets up Node.js, installs dependencies (`npm ci`), and verifies TypeScript compilation and production bundle build (`npm run build`).

---

## 4. Planned Extensions

- **Learning Paths & Progress Tracking**: Step-by-step progress tracking for technical topics.
- **Async Workers**: Local Redis + Celery worker setup for asynchronous operations.
- **NLP/ML Pipeline**: Automatic skill extraction from project descriptions and repository links.
