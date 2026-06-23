# ADR 0001: Use NestJS for Backend API

## Status

Accepted

## Context

The task allows using either NestJS or Express for the backend.

The backend must expose a REST API for asynchronous URL check jobs and should be written in TypeScript.

The API includes:

* job creation
* job listing
* job details
* job cancellation
* background processing integration
* validation
* error handling

The project should be small enough for a test assignment, but structured enough to show production-oriented thinking.

## Decision

Use NestJS as the backend framework.

NestJS provides a structured application architecture with modules, controllers, services, dependency injection, validation support, and testing utilities.

## Why NestJS

NestJS is a good fit for this project because it gives a clear separation between:

* controller layer
* service layer
* repository layer
* background processing integration
* DTO validation
* tests

This helps keep the implementation readable and maintainable.

## Alternatives Considered

### Express

Pros:

* simple and lightweight
* less boilerplate
* fast to start

Cons:

* project structure must be designed manually
* dependency injection must be added manually or avoided
* validation and error handling need more manual setup
* can become less organized as the project grows

## Consequences

Positive consequences:

* clear backend structure
* easier separation of responsibilities
* easier testing through dependency injection
* consistent error handling
* better fit for a professional test assignment

Tradeoffs:

* more initial boilerplate than Express
* slightly heavier framework
* more files for a small task

## Production Notes

For a production version, NestJS can be extended with:

* database modules
* authentication guards
* rate limiting
* structured logging
* OpenAPI documentation
* health checks
* metrics and tracing
