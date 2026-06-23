# ADR 0002: Use In-Memory Storage

## Status

Accepted

## Context

The assignment allows in-memory storage.

The application needs to store:

* jobs
* URL checks
* job statuses
* URL check results
* timestamps and duration

## Decision

Use an in-memory `Map` inside `JobsRepository`.

```txt
Map<jobId, Job>
```

The repository is responsible for:

* creating jobs
* listing jobs
* finding jobs by id
* cancelling jobs
* updating URL check states
* recalculating final job status

## Consequences

Positive:

* simple implementation
* no database setup required
* fast tests
* easy to replace later because storage is isolated behind `JobsRepository`

Trade-offs:

* data is lost when the backend restarts
* multiple backend instances would not share job state
* not suitable for production without replacing the repository

## Future Improvement

A persistent implementation could replace `JobsRepository` with:

```txt
PostgreSQL
Redis
MongoDB
```

The REST API contract can stay the same.
