# ADR-005
: Use a Custom User Manager

- **Status:** Accepted
- **Date:** 2026-07-28

## Context

FUTMXStore uses a custom `User` model built on Django's `AbstractUser`. While Django provides a default `UserManager`, the project requires additional control over how users are created and managed.

As the platform grows, user creation will involve more than simply storing a username and password. Different users may have different onboarding requirements, roles, profile creation logic, or validation rules.

Keeping this logic inside models or views would violate the principle of separation of concerns and make the codebase harder to maintain.

---

## Decision

FUTMXStore will use a custom `UserManager` that extends Django's `BaseUserManager`.

The manager will be responsible for creating users and superusers while encapsulating all object creation logic.

Typical responsibilities include:

- Creating regular users.
- Creating superusers.
- Normalizing email addresses.
- Setting encrypted passwords.
- Applying default values.
- Performing validation during user creation.

Business logic that relates specifically to constructing `User` objects will remain inside the manager rather than the model or view.

---

## Rationale

This decision was made for several reasons.

### Separation of Concerns

The `User` model should describe what a user **is**, while the manager should define **how a user is created**.

Keeping creation logic separate makes both components easier to understand and maintain.

### Single Source of Truth

Every part of the application creates users through the same manager.

This prevents duplication of user creation logic across views, serializers, management commands, or background tasks.

### Improved Maintainability

Future changes to the registration process only need to be implemented in one place.

For example, if new validation rules or default values are introduced, they can be added to the manager without modifying every user creation endpoint.

### Better Testability

The manager can be tested independently, ensuring that every user is created consistently regardless of where the request originates.

### Scalability

As FUTMXStore evolves, user creation may involve additional responsibilities such as profile creation, audit logging, email verification, or assigning default roles.

Using a custom manager provides a centralized location for implementing these features.

---

## Consequences

### Positive

- Centralized user creation logic.
- Cleaner models.
- Consistent object creation.
- Easer maintenance.
- Supports future expansion.

### Negative

- Slightly more code than Django's default implementation.
- Developers must always use the manager when creating users.

The benefits of consistency and maintainability outweigh the small increase in complexity.

---

## Alternatives Considered

### Use Django's Default UserManager

The default manager is sufficient for simple applications.

However, FUTMXStore requires custom user creation behavior and future extensibility, making a custom manager the better long-term choice.

---

## Summary

User creation is a business process, not merely a database operation.

By encapsulating object creation inside a custom manager, FUTMXStore maintains a clean architecture where models describe data and managers coordinate object creation.

> **Architectural Principle:** Models define data. Managers define object creation.