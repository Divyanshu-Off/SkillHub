# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

This is a Vite + React 19 + TypeScript frontend application. Commonly used commands:

- `npm run dev` - Start the development server with HMR
- `npm run build` - Build for production (runs TypeScript compilation then Vite build)
- `npm run lint` - Run Oxlint for linting (configured in .oxlintrc.json)
- `npm run preview` - Preview the production build locally
- `npm install` - Install dependencies

Note: There is currently no test runner configured for the frontend.

## Architecture & Structure

### High-Level Organization
- `src/main.tsx` - Entry point where React Query and AuthProvider wrap the router
- `src/App.tsx` - Defines the route tree and shared Navbar layout
- `src/pages/` - Page components (HomePage, PathsPage, ProjectsPage, SignInPage, SignUpPage, SignOutPage)
- `src/components/` - Reusable components (Navbar, BackgroundGlow, AuthModal, RouteGuards)
- `src/context/` - React context (AuthContext for authentication state)
- `src/services/` - Service modules for API calls (apiClient, authService, projectService, pathService)
- `src/types/` - TypeScript type definitions (project, auth, path)
- `src/assets/` - Static assets (images, icons)

### Key Conventions
- API calls are made through typed service modules in `src/services/` using the shared `apiClient` (which attaches the access token from localStorage)
- Authentication state is managed via `AuthContext` and route guards
- Request/response shapes follow the backend's paginated format: `{ count, next, previous, results }`
- Styling follows Tailwind-first approach with existing UI/component libraries preferred
- TypeScript is configured with strict unused-local/unused-parameter checks via `tsconfig.app.json`

### Related Documentation
See `.github/copilot-instructions.md` in the repository root for:
- Full-stack repository shape (backend is Django 5.x + DRF)
- Setup instructions for both backend and frontend
- Backend-specific commands and API conventions
- Validation expectations for changes