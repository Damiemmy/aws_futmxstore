# ADR-010: Containerized Deployment Architecture for FUTMxStore MVP

## Status

Accepted

## Date

2026-08-30

## Context

FUTMxStore is being developed as a SaaS academic resource platform with a React frontend and Django REST API backend.

As the project moves toward its first MVP deployment, the application requires a consistent and reproducible runtime environment for development, testing, and production.

The deployment architecture must:

- Separate frontend, backend, and database responsibilities.
- Provide a production-ready PostgreSQL database.
- Route external traffic through a controlled entry point.
- Allow the frontend and backend to communicate securely within the application network.
- Make the application reproducible across environments.
- Simplify deployment and future infrastructure scaling.

## Decision

We will use a containerized architecture managed with Docker Compose.

The initial MVP deployment will consist of four primary services:

1. React Frontend
2. Django REST API Backend
3. PostgreSQL Database
4. Nginx Reverse Proxy

Nginx will serve as the public-facing entry point and traffic gateway.

### Architecture

```text
                    INTERNET
                        │
                        ▼
                 ┌─────────────┐
                 │    NGINX    │
                 │ Reverse     │
                 │ Proxy       │
                 └──────┬──────┘
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
     ┌──────────────┐      ┌──────────────┐
     │ React        │      │ Django REST  │
     │ Frontend     │      │ API          │
     └──────────────┘      └──────┬───────┘
                                  │
                                  ▼
                           ┌──────────────┐
                           │ PostgreSQL   │
                           │ Database     │
                           └──────────────┘