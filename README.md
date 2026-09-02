FUTMxStore

> **A role-based academic resource platform designed to make lecture materials and past questions easier for students to discover, access, and manage.**

FUTMxStore is a full-stack SaaS-style academic platform built around a structured academic hierarchy:

**Faculty → Department → Level → Semester → Course → Materials**

The platform is designed to solve a common problem in student communities: academic resources are often scattered across WhatsApp groups, Telegram channels, personal devices, and informal networks.

FUTMxStore provides a centralized system where academic resources can be organized around the actual structure of an institution.



## Product Vision

The long-term vision of FUTMxStore is to become a reliable academic ecosystem connecting:

* Students
* Course Representatives
* Lecturers
* Vendors
* Administrators

through a structured digital platform for academic resources and services.

However, the current version intentionally focuses on the **Academic Foundation** before expanding into additional platform capabilities.


# Current MVP Scope

The current MVP focuses on three foundational domains:

### Authentication

* User registration
* User login
* JWT authentication
* Custom user model
* Email-based authentication
* User verification architecture
* Protected API endpoints

### Users & Roles

The platform is designed around multiple user roles:

| Role                  | Responsibility                                |
| --------------------- | --------------------------------------------- |
| Student / Customer    | Discover and access academic resources        |
| Course Representative | Manage approved course resources              |
| Lecturer              | Provide/manage academic resources             |
| Vendor                | Reserved for future marketplace functionality |
| Administrator         | Platform administration and moderation        |

Not every authenticated user is automatically permitted to upload academic materials.

Permissions are determined by the user's role and the platform's business rules.



# 🏫 Academic Structure

FUTMxStore models academic resources according to the structure students already understand.

Faculty
   │
   └── Department
          │
          └── Level
                 │
                 └── Semester
                        │
                        └── Course
                               │
                               └── Materials


This allows resources to be discovered through academic context rather than relying entirely on unrestricted file uploads or an unstructured content feed.

### Example

School of Computing
        │
        └── Computer Science
                │
                └── 300 Level
                       │
                       └── First Semester
                              │
                              └── CSC 301
                                     │
                                     ├── Lecture Notes
                                     ├── Past Questions
                                     └── Course Materials



# 🧠 Core Design Principle

The backend is the **source of truth**.

The frontend should never be responsible for enforcing critical business rules.


                 ┌──────────────────┐
                 │     React App     │
                 │   Presentation    │
                 └────────┬─────────┘
                          │
                          │ REST API
                          ▼
                 ┌──────────────────┐
                 │   Django + DRF   │
                 │                  │
                 │ Business Rules   │
                 │ Permissions      │
                 │ Validation       │
                 │ Authentication   │
                 │ API Contracts    │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │    Database      │
                 │   PostgreSQL     │
                 └──────────────────┘


This architecture allows the frontend to evolve without moving business-critical logic into the client.



# 🏗️ Architecture

FUTMxStore follows a modern full-stack architecture.


                       CLIENT
                         │
                         ▼
                 ┌───────────────┐
                 │ React + Vite  │
                 │  TypeScript   │
                 └───────┬───────┘
                         │
                         │ HTTP / REST
                         ▼
                 ┌───────────────┐
                 │ Django REST   │
                 │   Framework   │
                 └───────┬───────┘
                         │
             ┌───────────┼───────────┐
             │           │           │
             ▼           ▼           ▼
       Authentication  Academic   Materials
                       Domain
             │           │           │
             └───────────┼───────────┘
                         │
                         ▼
                 ┌───────────────┐
                 │  PostgreSQL   │
                 └───────────────┘


The architecture is intentionally modular so that future services such as payments, notifications, background jobs, search, analytics, and marketplace functionality can be introduced without restructuring the entire application.



# 🛠️ Technology Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Axios
* React Router
* React Hook Form
* Zod
* Zustand

## Backend

* Python
* Django
* Django REST Framework
* Simple JWT
* Django ORM

## Database:

### Development

* SQLite

### Production

* PostgreSQL

## Infrastructure

* Docker
* Docker Compose
* Nginx
* Gunicorn
* Redis
* Celery

Redis and Celery provide the foundation for future asynchronous workloads such as:

* Email processing
* Notifications
* Background tasks
* Scheduled jobs



# 🔐 Authentication Architecture

FUTMxStore uses a custom Django user model built on Django's `AbstractUser`.

The user system is designed around email-based authentication.


Registration
     │
     ▼
User Creation
     │
     ▼
Customer Role
     │
     ▼
Verification
     │
     ▼
Authenticated User


The backend controls authentication and authorization.

Protected resources require appropriate authentication and permissions.



# 👥 Role-Based Access Control

FUTMxStore uses multiple roles because academic platforms have different levels of responsibility.

A student should not automatically have the same capabilities as a lecturer, course representative, or administrator.

The permission architecture therefore separates:

Authentication
      │
      ▼
Who are you?
      │
      ▼
Authorization
      │
      ▼
What are you allowed to do?


This distinction is fundamental to the platform.


# 📚 Academic Resource Management

Materials are associated with academic context rather than existing as isolated files.

A material belongs to a course, and the course belongs to the appropriate academic structure.

Faculty
  ↓
Department
  ↓
Level
  ↓
Semester
  ↓
Course
  ↓
Material


This creates a predictable resource discovery model.


# 📄 Materials

The material system is designed to support academic resources such as:

* Lecture materials
* Course notes
* Past questions
* Study resources
* Other approved academic documents

Material uploads are permission-controlled.

The platform does not assume that every registered student should be able to upload arbitrary resources.

# 🔒 Business Rules

One of the core engineering principles of FUTMxStore is that **business rules belong in the backend**.

For example:

Student
   │
   └── Can access permitted resources

Course Representative
   │
   └── Can manage resources according to assigned permissions

Lecturer
   │
   └── Can manage lecturer-authorized academic resources

Administrator
   │
   └── Platform-level management


The frontend may hide unavailable actions, but the backend remains responsible for enforcing the actual permission.



# 🔄 API Architecture

The backend exposes RESTful APIs consumed by the React frontend.

Typical request flow:


React
  │
  ▼
Axios
  │
  ▼
API Endpoint
  │
  ▼
Authentication
  │
  ▼
Permission Check
  │
  ▼
Serializer Validation
  │
  ▼
Business Logic
  │
  ▼
Django ORM
  │
  ▼
Database


This creates a clean separation between presentation and domain logic.



# 🧩 Backend Architecture

The backend is structured around separation of responsibilities.


Request
   │
   ▼
URL
   │
   ▼
View
   │
   ▼
Serializer
   │
   ▼
Service / Business Logic
   │
   ▼
Selectors / Data Access
   │
   ▼
Model / ORM
   │
   ▼
Database

The architecture avoids placing all application logic inside views.

This makes the backend easier to:

* Test
* Maintain
* Extend
* Refactor
* Reason about


# 🗂️ Project Structure

The exact structure may evolve as the platform grows, but the architecture follows a separation similar to:


FUTMxStore/
│
├── backend/
│   │
│   ├── authentication/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── services.py
│   │   ├── selectors.py
│   │   └── ...
│   │
│   ├── academics/
│   │
│   ├── materials/
│   │
│   ├── manage.py
│   └── ...
│
├── frontend/
│   │
│   ├── src/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── components/
│   │   ├── dashboards/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   │
│   └── ...
│
├── nginx/
│
├── docker-compose.yml
│
├── .dockerignore
├── .gitignore
└── README.md




# 🐳 Containerized Architecture

The deployment architecture is designed around independent services.


                    NGINX
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
       FRONTEND                BACKEND
       React/Vite             Django/DRF
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    ▼             ▼             ▼
               PostgreSQL       Redis        Celery


Docker Compose provides the service orchestration layer during development and deployment.



# 🌐 Nginx

Nginx acts as the reverse proxy and public entry point.

Responsibilities include:

* Routing frontend traffic
* Routing API requests
* Serving static assets
* Serving media files
* Acting as the boundary between public traffic and application services

Conceptually:


Browser
   │
   ▼
Nginx
   │
   ├── /              → React
   │
   ├── /api/          → Django REST API
   │
   ├── /static/       → Static files
   │
   └── /media/        → Media files



# ⚙️ Environment Configuration

The project separates development and production configuration.

Sensitive configuration is provided through environment variables rather than committed source code.

Examples include:


SECRET_KEY
DATABASE_URL
DATABASE credentials
JWT configuration
CORS configuration
CSRF configuration
ALLOWED_HOSTS
Email credentials


Development and production settings are intentionally separated to prevent development conveniences from leaking into production deployments.


# 🛡️ Security Principles

Security is enforced primarily at the backend boundary.

The project considers:

* Authentication
* Authorization
* JWT token handling
* Role-based permissions
* CSRF protection
* CORS configuration
* Environment-based secrets
* Server-side validation
* Restricted allowed hosts
* Protected administrative operations

The frontend is treated as an untrusted client.



# 🎯 Why FUTMxStore?

Many academic platforms focus primarily on uploading files.

FUTMxStore focuses on **organizing academic knowledge around institutional structure**.

Instead of:

Random Files
    ↓
Random Folders
    ↓
Hard-to-find Resources


the goal is:

Institution
   ↓
Faculty
   ↓
Department
   ↓
Level
   ↓
Semester
   ↓
Course
   ↓
Resources

This creates a foundation for a much larger academic ecosystem.


# 🗺️ Product Roadmap

The platform is intentionally being developed in stages.

## Phase 1 — Academic Foundation

* [x] Authentication foundation
* [x] Custom user model
* [x] Role architecture
* [x] Academic hierarchy
* [x] Course structure
* [x] Materials architecture
* [x] Permission foundation
* [x] REST API foundation

## Phase 2 — Academic Platform

Planned:

* [ ] Improved material discovery
* [ ] Course dashboards
* [ ] Course representative workflows
* [ ] Lecturer workflows
* [ ] Material moderation
* [ ] Better resource management
* [ ] Search and filtering

## Phase 3 — Marketplace

Future functionality:

* [ ] Vendors
* [ ] Products
* [ ] Marketplace
* [ ] Cart
* [ ] Orders
* [ ] Payments
* [ ] Vendor dashboards

## Phase 4 — Platform Intelligence

Future functionality:

* [ ] Notifications
* [ ] Analytics
* [ ] AI-assisted academic discovery
* [ ] Intelligent recommendations
* [ ] Automated workflows

> These future phases are intentionally excluded from the current MVP until the academic foundation is stable.


# 🧪 Testing Strategy

The project is intended to evolve toward comprehensive automated testing.


Testing will cover:

### Backend

* Model tests
* Serializer tests
* Authentication tests
* Permission tests
* API tests
* Business-rule tests

### Frontend

* Component tests
* Form validation
* Authentication flows
* Protected routes
* API integration

### Integration

Frontend
   ↓
API
   ↓
Authentication
   ↓
Business Logic
   ↓
Database


The objective is to verify not only individual components but also critical end-to-end workflows.


# 📈 Scalability Strategy

FUTMxStore is designed so that additional platform capabilities can be introduced incrementally.

Potential future architecture:


                       NGINX
                         │
                         ▼
                    API Gateway
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   Authentication    Academics        Marketplace
        │                │                │
        └────────────────┼────────────────┘
                         │
                 Background Jobs
                         │
                    Redis/Celery
                         │
                         ▼
                    PostgreSQL


As usage increases, individual components can be optimized or scaled independently.


# 💡 Engineering Lessons

FUTMxStore is being developed as an exercise in building software around **business domains rather than simply building pages**.

Key architectural principles include:

### Backend-first development

The backend defines:

* Business rules
* Data models
* Permissions
* Validation
* API contracts

### Separation of concerns

Authentication, business logic, data access, presentation, and infrastructure should have clear responsibilities.

### Explicit permissions

A user's ability to perform an operation should be determined by backend authorization rules.

### Incremental architecture

The system is being built in stable phases rather than attempting to implement every planned feature simultaneously.


# 🚧 Project Status

**Status: Active Development**

FUTMxStore is currently focused on establishing a stable academic foundation before expanding into marketplace and intelligence features.

The project is intentionally evolving through incremental architectural milestones.


# 👨🏽‍💻 Author

## Damisa Emmanuel

Full-Stack Developer building scalable web applications with:


Python
Django
Django REST Framework
React
TypeScript
Next.js
PostgreSQL
Docker
Nginx
REST APIs


Interested in building systems that combine strong backend architecture, modern frontend engineering, and production-oriented infrastructure.


# 📄 License

This project is currently developed as a personal/educational software project.
