# Development Workflow

## Overview

This document describes the development workflow used in this repository.

The goal is to keep the project history readable and professional, even though this is a test assignment.

The implementation is organized into small branches and meaningful commits.

---

## Branch Strategy

The project uses a lightweight feature branch workflow.

Main branch:

```txt
main
```

Feature branches:

```txt
docs/project-architecture
feature/backend-bootstrap
feature/backend-jobs-api
feature/backend-inngest-processing
feature/backend-cancellation
feature/backend-docker
feature/frontend-bootstrap
feature/frontend-jobs-ui
```

Each branch should focus on one clear area.

---

## Commit Style

Commits follow the Conventional Commits format.

Examples:

```txt
chore: initialize backend application
docs: add initial backend architecture
docs: add api contract
feat(jobs): add in-memory jobs repository
feat(jobs): add create job endpoint
feat(inngest): configure background processing
feat(jobs): add cancellation flow
test(jobs): cover job repository
chore(docker): add backend docker setup
```

---

## Commit Types

| Type       | Usage                                          |
| ---------- | ---------------------------------------------- |
| `chore`    | Project setup, tooling, dependency changes.    |
| `docs`     | Documentation-only changes.                    |
| `feat`     | New functionality.                             |
| `fix`      | Bug fixes.                                     |
| `test`     | Tests.                                         |
| `refactor` | Internal code changes without behavior change. |

---

## Recommended Development Order

### 1. Documentation and architecture

Prepare initial project documentation before implementation.

Recommended commits:

```txt
docs: add initial backend architecture
docs: add api contract
docs: add architecture decision records
```

### 2. Backend bootstrap

Initialize the NestJS backend application.

Recommended commits:

```txt
chore: initialize backend application
chore(backend): configure exact dependency saving
```

### 3. Backend jobs domain

Add job types, statuses, repository, and service layer.

Recommended commits:

```txt
feat(jobs): add job domain types
feat(jobs): add in-memory jobs repository
feat(jobs): add job summary and details mapping
```

### 4. Backend REST API

Add required REST endpoints.

Recommended commits:

```txt
feat(jobs): add create job endpoint
feat(jobs): add job list endpoint
feat(jobs): add job details endpoint
feat(jobs): add job cancellation endpoint
```

### 5. Inngest processing

Add background processing.

Recommended commits:

```txt
feat(inngest): configure inngest client
feat(inngest): add url check processing function
feat(inngest): add per-job concurrency control
feat(inngest): add artificial delay before saving results
```

### 6. Cancellation and edge cases

Add cancellation behavior and stale update guards.

Recommended commits:

```txt
feat(jobs): add cancellation workflow
fix(jobs): prevent stale result updates after cancellation
```

### 7. Tests

Add focused tests for service and repository behavior.

Recommended commits:

```txt
test(jobs): cover repository state transitions
test(jobs): cover job cancellation behavior
test(jobs): cover job summary statistics
```

### 8. Docker

Add Dockerfile and docker-compose.

Recommended commits:

```txt
chore(docker): add backend dockerfile
chore(docker): add docker compose setup
```

### 9. Frontend

Frontend should be implemented after backend behavior is stable.

Recommended commits:

```txt
chore(frontend): initialize react application
feat(frontend): add jobs state management
feat(frontend): add job creation form
feat(frontend): add jobs list
feat(frontend): add job details polling
feat(frontend): add cancellation action
```

---

## Dependency Policy

Dependencies should be added intentionally.

The project uses exact dependency versions where possible.

Avoid using:

```txt
npm audit fix --force
```

Reason:

* it may change dependency versions unexpectedly
* it can make the dependency tree less predictable
* it is better to update dependencies intentionally

If an audit warning appears for a transitive dependency, document it and evaluate whether it affects the actual API surface.

---

## Pull Request Style

Even when working alone, it is useful to keep branches focused.

A good pull request should include:

* short description
* what was changed
* how it was tested
* any known limitations

Example:

```txt
## Summary

Added backend job domain model and in-memory repository.

## Testing

- npm run test
- npm run start:dev

## Notes

Storage is intentionally in-memory according to the task requirements.
```

---

## Local Verification Checklist

Before committing backend changes:

```bash
npm run lint
npm run test
npm run build
```

Before submitting the whole project:

```bash
docker compose up --build
```

Then verify:

* backend starts successfully
* frontend starts successfully
* job can be created
* job details are updated through polling
* job can be cancelled
* old polling responses do not overwrite active job state
