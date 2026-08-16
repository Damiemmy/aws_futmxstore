# ADR-008: Material Uploader Deletion Policy

**Status:** Accepted
**Date:** 2026-08-12

## Context

FUTMxStore stores academic materials uploaded by users. Each material maintains a relationship with the user who uploaded it through the `uploaded_by` foreign key.

Uploaded materials are considered persistent academic content and should remain available independently of the uploader's current account status.

The system therefore needs to define what should happen when a user who has uploaded materials is deleted.

The following strategies were evaluated:

| Strategy   | Behavior                                                              |
| ---------- | --------------------------------------------------------------------- |
| `CASCADE`  | Delete the user's uploaded materials when the user is deleted         |
| `SET_NULL` | Preserve the materials but remove the uploader relationship           |
| `PROTECT`  | Prevent deletion of the user while materials still reference the user |

## Decision

FUTMxStore will use `models.PROTECT` for the `Material.uploaded_by` relationship.

```python
uploaded_by = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.PROTECT,
    related_name="uploaded_materials",
)
```

This enforces the rule that a user cannot be physically deleted while existing materials still reference that user as their uploader.

If deletion is attempted, Django raises a `ProtectedError`.

## Rationale

### Why not `CASCADE`?

`CASCADE` would automatically delete all materials uploaded by the user.

```text
User deleted
     ↓
Materials deleted
     ↓
Potential loss of academic content
```

This is undesirable because materials may continue to provide value to students even when the uploader is no longer active on the platform.

### Why not `SET_NULL`?

`SET_NULL` would preserve the materials but remove their uploader relationship.

```text
User deleted
     ↓
Material remains
     ↓
uploaded_by = NULL
```

Although this prevents content loss, it removes historical attribution and requires the relationship to allow `NULL` values.

### Why `PROTECT`?

`PROTECT` preserves both the material and its uploader relationship.

```text
User
  ↓
Material
  ↓
Uploader relationship preserved
```

The database relationship therefore maintains historical attribution while preventing accidental data loss.

This establishes an explicit data-integrity boundary around material ownership and uploader history.

## Consequences

### Positive

* Prevents accidental deletion of academic materials through user deletion.
* Preserves historical uploader attribution.
* Maintains the integrity of the `Material → User` relationship.
* Forces user-deletion workflows to explicitly consider dependent materials.
* Protects persistent academic content from unintended cascading deletion.

### Negative

* Users with uploaded materials cannot be physically deleted immediately.
* Account deactivation must be treated separately from physical deletion.
* A future administrative deletion workflow must explicitly handle dependent materials.

## Future Consideration

FUTMxStore may distinguish between **account deactivation** and **physical account deletion**.

For example:

```text
User
 ├── is_active = False
 └── uploaded materials remain
```

This allows a user to lose platform access while preserving their historical relationship with previously uploaded materials.

Any future physical-deletion workflow must respect the `Material.uploaded_by` constraint and explicitly handle dependent records.

## Alternatives Considered

| Option     | Behavior                                        | Decision     |
| ---------- | ----------------------------------------------- | ------------ |
| `CASCADE`  | Delete materials when uploader is deleted       | Rejected     |
| `SET_NULL` | Preserve materials but remove uploader          | Rejected     |
| `PROTECT`  | Prevent uploader deletion while materials exist | **Accepted** |

## Architectural Principle

FUTMxStore treats uploaded materials as persistent domain data rather than temporary user-owned records.

The uploader relationship is therefore considered part of the material's historical integrity.

> **A user who has uploaded materials must not be physically deleted while those materials still reference the user.**

Django's `models.PROTECT` is used to enforce this architectural decision at the application and database relationship level.
