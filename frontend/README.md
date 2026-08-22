# FUTMxStore frontend

React + TypeScript + Vite frontend for the existing Django REST API.

## Run

1. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` when needed.
2. Run `npm install`.
3. Run `npm run dev`.

The API client uses the backend JWT contract. Access and refresh tokens are kept in `sessionStorage` so a browser restart clears the session; the access token is copied into memory for Axios request headers. The backend remains authoritative for permissions and validation.

The backend currently exposes only `course` filtering for materials, so faculty, department, and level selections narrow the course selector client-side. No backend files were changed.