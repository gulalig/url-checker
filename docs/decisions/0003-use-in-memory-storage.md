# ADR 0003: Use In-Memory Storage

## Status

Accepted

## Context

The task explicitly states that a database is not required and that in-memory storage is enough.

The backend needs to store:

* created jobs
* job statuses
* URL check records
* URL check statuses
* HTTP status codes
* error messages
* start and finish timestamps
* processing duration

The goal of the assignment is to demonstrate asynchronous processing, concurrency control, cancellation, polling behavior, and clean API design.

Adding a database at this stage would increase infrastructure and implementation complexity without being required by the task.

## Decision

Use in-memory storage based on a `Map`.

The storage will be hidden behind a repository abstraction.

The rest of the application should not directly depend on the internal `Map` implementation.

## Why In-Memory Storage

In-memory storage is a good fit for this task because:

* the assignment allows it
* it keeps the implementation simple
* it avoids database setup and migrations
* it keeps the focus on async job processing
* it is easy to test
* it is enough for local development and demo purposes

## Storage Structure

The repository stores jobs by ID.

Each job contains:

* job ID
* creation timestamp
* job status
* list of URL check records

Each URL check record contains:

* URL
* status
* HTTP status
* error message
* start timestamp
* finish timestamp
* duration in milliseconds

## Limitations

In-memory storage has important limitations:

* data is lost after server restart
* data is not shared between multiple backend instances
* it is not suitable for horizontal scaling
* it does not provide persistence
* it does not provide query capabilities like a real database

These limitations are acceptable for this assignment because persistent storage is not required.

## Production Alternative

For a production version, the repository could be replaced with a persistent storage implementation.

Possible options:

* PostgreSQL for job metadata and URL check results
* Redis for temporary job state
* a combination of PostgreSQL and Redis
* managed queue storage depending on the background processing provider

The repository abstraction makes this replacement easier because the rest of the application depends on repository methods, not on the storage implementation itself.

## Consequences

Positive consequences:

* simple implementation
* no extra infrastructure
* fast local startup
* easy test setup
* clear focus on job lifecycle logic

Tradeoffs:

* no persistence
* no multi-instance support
* state is lost after restart
* not production-ready as-is

## Summary

In-memory storage is intentionally chosen because it matches the assignment requirements and keeps the solution focused.

The design still keeps a repository abstraction so that persistent storage can be introduced later without rewriting the controller and service layers.
