# Copilot instructions for SkillHub

## Repository shape

SkillHub is a full-stack learning-path and portfolio application:

- `backend/` is a Django 5.x + Django REST Framework API backed by PostgreSQL.
- `frontend/` is a Vite + React 19 + TypeScript single-page application using React Router, TanStack Query, Axios, Tailwind CSS, and Framer Motion.
- `.github/workflows/ci.yml` runs backend and frontend checks as separate jobs. The backend job provisions PostgreSQL 16, runs migrations, and executes Django tests; the frontend job runs the production build.

The backend is organized by domain apps:

- `users/` contains registration and current-user endpoints, using Django's built-in `User`.
- `projects/` owns portfolio project models, serializers, and domain views.
- `paths/` owns `LearningPath` and `PathStep`, including enrollment and step-completion actions.
- `progress/` stores per-user path and step progress models.
- `api/` contains the central router, project viewset, and shared ownership permission.
- `skillhub/` contains settings and the root `/api/` and `/admin/` URL mounts.

The frontend starts in `src/main.tsx`, where React Query and `AuthProvider` wrap the router. `App.tsx` defines the route tree and shared `Navbar` layout. Pages call typed service modules in `src/services/`; `src/services/apiClient.ts` is the single Axios client and attaches the access token from `localStorage`. `AuthContext` owns login, registration, profile hydration, and logout; route guards handle guest-only and authenticated flows.

## Setup and environment

Use the documented local setup in `docs/setup.md`:

1. Create a PostgreSQL database named `skillhub`.
2. In `backend/`, create/activate a virtual environment and install `requirements.txt`.
3. Create `backend/.env` with `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, and `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, and `DB_PORT`.
4. In `frontend/`, install npm dependencies and create `.env` with `VITE_API_BASE_URL=http://127.0.0.1:8000/api`.

Do not commit `.env` files, virtual environments, `node_modules`, or build output; the repository `.gitignore` already excludes them.

## Commands

Run commands from the directory shown.

### Backend

```powershell
cd backend
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
python manage.py test
```

Run one Django app or one test case/method with the standard Django labels:

```powershell
cd backend
python manage.py test projects
python manage.py test projects.tests.ProjectAPITests
python manage.py test projects.tests.ProjectAPITests.test_create_project_authenticated
```

The backend expects PostgreSQL settings from `backend/.env`; the CI job supplies equivalent environment variables and uses PostgreSQL 16. There is no separate backend lint script configured in the repository.

### Frontend

```powershell
cd frontend
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

`npm run build` performs the TypeScript project build before `vite build`. `npm run lint` invokes Oxlint using `frontend/.oxlintrc.json`. There is currently no frontend test script or test runner configured, so a single frontend test command does not exist.

## API and data conventions

- Register API routes in `backend/api/urls.py` and use DRF routers for resource viewsets (`projects`, `paths`, and `steps`).
- Keep serializers in the owning domain app. Set server-owned fields such as `owner`, timestamps, and computed progress fields to read-only; assign `owner` in `perform_create`.
- The global DRF defaults use JWT authentication, `IsAuthenticatedOrReadOnly`, and page-number pagination with a page size of 20.
- Public reads are intentional. Mutations require authentication, and project/path updates use `api.permissions.IsOwnerOrReadOnly` so only the object's owner can edit or delete it.
- Learning-path progress is user-specific: `PathStepSerializer` derives `is_completed`, `LearningPathSerializer` derives totals, and the step `toggle_completion` action also ensures a `UserPathProgress` record exists.
- Preserve the existing endpoint shapes, including `/api/auth/register/`, `/api/auth/jwt/create/`, `/api/auth/jwt/refresh/`, `/api/auth/me/`, `/api/projects/`, `/api/paths/`, and `/api/steps/`.

## Frontend conventions

- Keep API calls in typed service modules rather than issuing Axios requests directly from page components.
- Reuse the shared `apiClient`; it applies `VITE_API_BASE_URL` and attaches `access_token` as a Bearer token.
- Keep shared authentication state in `AuthContext` and use `useAuth`/route guards instead of duplicating token checks in pages.
- Keep request/response shapes in `src/types/` and preserve the backend's paginated `{ count, next, previous, results }` response shape.
- `tsconfig.app.json` enables strict unused-local/unused-parameter checks and bundler module resolution. The frontend uses React function components and type-only imports where required by `verbatimModuleSyntax`.
- Follow the existing Tailwind-first styling and dark visual system in the page/component CSS and class names; use the existing UI/icon libraries before adding a new styling or component dependency.

## Validation expectations

For backend changes, run the narrowest relevant Django test, then `python manage.py test` when shared API/auth/model behavior is affected. For frontend changes, run `npm run lint` and `npm run build`; the latter is the CI validation and catches TypeScript errors as well as bundling failures.
