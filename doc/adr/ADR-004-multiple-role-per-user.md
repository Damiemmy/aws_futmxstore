# ADR-004: Support Multiple Roles Per User

- **Status:** Accepted
- **Date:** 2026-07-28

## Context

As FUTMXStore evolved from a simple bookstore into a university academic platform, an important architectural question emerged:

> Should a user have only one role, or should a single user be able to hold multiple roles at the same time?

This decision affects authentication, authorization, permissions, dashboard rendering, database design, and future scalability.

Unlike a traditional e-commerce application, users within a university often perform multiple responsibilities simultaneously. For example:

- A student can also be a vendor.
- A course representative is still a student.
- A lecturer may also sell academic resources.
- An administrator may also teach courses.

Restricting users to a single role would not accurately reflect how the university environment operates.

---

## Decision

FUTMXStore will support **multiple active roles per user**.

A user account represents a person, while roles represent the responsibilities that person performs within the system.

Instead of replacing one role with another, additional roles can be assigned to the same account whenever necessary.

Example:

```text
Damisa
├── Student
├── Vendor
└── Course Representative
```

---

## Rationale

This decision was made for several reasons.

### Reflects Real-World Scenarios

University users frequently perform more than one responsibility. Supporting multiple roles allows the application to model real-life situations instead of imposing technical limitations.

### Better User Experience

Users only need one account and one login to access all the features they are authorized to use. This removes the need for multiple accounts or switching between identities.

### Eliminates Duplicate Accounts

Without multiple roles, users would need separate accounts for each responsibility, leading to duplicated profiles, fragmented data, and unnecessary complexity.

### Improves Scalability

Future roles such as Alumni, Teaching Assistant, Library Staff, or Campus Ambassador can be introduced without redesigning the authentication system or database structure.

### Cleaner Domain Model

A user represents an identity.

Roles represent permissions.

Separating these concepts keeps the system easier to understand, maintain, and extend.

---

## Consequences

### Positive

- Models real university workflows.
- Supports future expansion.
- One account per user.
- Flexible permission management.
- Easier onboarding into additional responsibilities.

### Negative

- Authorization becomes more complex.
- Permission checks must consider multiple assigned roles.
- Dashboard rendering becomes more dynamic.

The additional complexity is acceptable because it provides a more scalable and maintainable architecture.

---

## Alternatives Considered

### One Role Per User

This approach is simpler to implement and makes permission checks easier.

However, it does not accurately represent how university users interact with the platform and would require users to create multiple accounts or switch identities whenever they assume new responsibilities.

For these reasons, this option was rejected.

---

## Implementation Notes

User identity and user roles are modeled separately.

```text
User
 │
 ├── Student
 ├── Vendor
 └── Course Representative
```

A junction table (`UserRole`) links users to one or more roles, allowing responsibilities to grow without changing the user's identity.

---

## Summary

The decision to support multiple roles aligns with FUTMXStore's long-term vision of becoming a scalable academic platform. Although it introduces additional complexity in authorization, it provides a more accurate representation of university users and creates a flexible foundation for future growth.

> **Architectural Principle:** A user represents a person; roles represent responsibilities.