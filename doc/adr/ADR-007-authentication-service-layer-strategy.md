# ADR-004: Authentication Service Layer Strategy

- **Status:** Accepted
- **Date:** 2026-08-07
- **Decision Makers:** FutMxStore Engineering Team

---

# Context

Authentication is the entry point into FutMxStore. Every protected feature depends on a secure, maintainable, and scalable authentication architecture.

Version 1 of FutMxStore supports:

- User Registration
- User Login
- JWT Authentication
- Token Refresh
- Logout
- Current Authenticated User (`/me`)

As the platform evolves, additional authentication features such as Email Verification, Password Reset, OAuth, Multi-Factor Authentication (MFA), and Login Auditing will be introduced.

To avoid tightly coupling authentication logic to Django REST Framework views or serializers, authentication responsibilities must be separated into clearly defined architectural layers.

---

# Problem

Without a defined architecture, business logic quickly becomes scattered across:

- Views
- Serializers
- Models

This creates several problems:

- Code duplication
- Difficult testing
- Tight coupling to HTTP
- Reduced maintainability
- Difficult future expansion

The authentication layer should remain reusable regardless of whether requests originate from:

- REST API
- GraphQL
- Mobile Applications
- Celery Tasks
- Management Commands
- Django Admin

---

# Decision

FutMxStore adopts a Service-Oriented Authentication Architecture.

Responsibilities are divided as follows.

---

## Views

Views are responsible only for HTTP concerns.

Responsibilities include:

- Receiving requests
- Invoking serializers
- Returning HTTP responses
- Defining permissions

Views must not contain business logic.

---

## Serializers

Serializers are responsible for:

- Input validation
- Output serialization
- Delegating business operations to services

Serializers do not directly implement authentication workflows.

---

## Services

Services own all authentication business workflows.

Examples include:

- Register User
- Login User
- Logout User

Services may:

- Create users
- Assign default roles
- Generate JWT tokens
- Trigger future verification workflows
- Execute business rules

Services remain independent of HTTP and return business objects or business data rather than HTTP responses.

---

## Selectors

Selectors centralize reusable read operations.

Examples include:

- Retrieve user by email
- Retrieve user by identifier
- Retrieve user roles

Selectors improve code reuse and reduce duplicated database queries throughout the project.

---

## Managers

Managers encapsulate object creation logic.

The custom `UserManager` is responsible for:

- Creating users
- Creating superusers
- Password hashing
- User normalization

Managers should not implement authentication workflows.

---

# JWT Strategy

JWT authentication is provided using Django REST Framework Simple JWT.

Business workflows surrounding authentication remain inside the service layer while cryptographic token generation relies on the well-tested Simple JWT implementation.

This avoids reinventing authentication infrastructure while preserving architectural boundaries.

---

## Registration

Registration uses a custom service because registration contains business rules such as:

- Create user
- Assign default Customer role
- Future email verification
- Future onboarding workflows

Registration therefore belongs inside the service layer.

---

## Login

Login is treated as a business workflow.

Responsibilities include:

- Authenticate credentials
- Verify account status
- Generate JWT tokens
- Support future login auditing
- Support future security policies

For these reasons, login is implemented through the authentication service.

---

## Refresh Token

Token refresh uses the built-in Simple JWT `TokenRefreshView`.

Reason:

Refreshing a JWT token contains no FutMxStore-specific business rules.

Delegating this responsibility to the framework avoids unnecessary abstraction and reduces maintenance overhead.

---

## Logout

Logout is implemented as a custom authentication service.

Reason:

Logout performs a business action by blacklisting refresh tokens.

Future logout behaviors may include:

- Audit logging
- Device tracking
- Security notifications
- Session analytics

The service layer provides a natural extension point for these future requirements.

---

## User Representation

All API responses representing authenticated users are centralized within `UserSerializer`.

Benefits include:

- Single source of truth
- Consistent API responses
- Easier frontend integration
- Reduced duplication
- Easier future expansion

Future additions such as:

- Avatar
- Active Roles
- Institution
- Profile Information
- Permissions

can be added in one location without modifying multiple endpoints.

---

# Consequences

## Advantages

- Clear separation of concerns
- Thin views
- Reusable business logic
- Easier unit testing
- Cleaner serializers
- Easier frontend integration
- Easier onboarding for future developers
- Supports future authentication features

---

## Trade-offs

The architecture introduces additional files compared to placing all logic inside views.

However, the increase in file count is justified by significantly improved maintainability, scalability, and long-term readability.

---

# Alternatives Considered

## Option 1 — Business Logic Inside Views

Rejected.

Reasons:

- Violates Separation of Concerns
- Difficult to test
- Poor scalability

---

## Option 2 — Business Logic Inside Serializers

Rejected.

Reasons:

- Couples business rules to DRF
- Difficult to reuse outside REST APIs
- Reduces architectural clarity

---

## Option 3 — Service-Oriented Authentication (Selected)

Accepted.

Reasons:

- Clear responsibility boundaries
- Highly reusable
- Easier testing
- Scalable architecture
- Supports future authentication features

---

# Future Considerations

Future authentication improvements may include:

- Email Verification
- Password Reset
- OAuth (Google, Microsoft, GitHub)
- Multi-Factor Authentication (MFA)
- Login History
- Device Management
- Account Lockout Policies
- Security Audit Logging

The selected architecture supports these features without requiring major refactoring.

---

# Guiding Principle

> **Architect for the Future. Implement for the Present.**

The authentication architecture intentionally separates business workflows from framework concerns while leveraging mature framework components where appropriate. This balances maintainability, scalability, and development speed for FutMxStore Version 1.