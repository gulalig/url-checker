# ADR 0002: Use Inngest for Background URL Processing

## Status

Accepted

## Context

The task requires asynchronous processing of URL check jobs.

After a job is created through `POST /api/jobs`, the API must immediately return a `jobId`, while URL checks continue in the background.

The task also requires:

* no more than 5 concurrent HEAD requests per job
* several jobs may be processed at the same time
* artificial random delay before saving each URL result
* job cancellation support
* no database requirement

A simple manual implementation with `Promise.all`, custom queues, timers, and cancellation flags would work, but it would put most workflow responsibility into application code.

## Decision

Use Inngest as the background processing layer.

Each URL check is represented as a separate Inngest event.

The URL check function is responsible for:

* marking the URL as `in_progress`
* performing the HTTP HEAD request
* waiting for a random delay
* saving the final result
* recalculating the parent job status

Concurrency is controlled by using a job-based concurrency key.

Cancellation is handled by sending a job cancellation event and using Inngest cancellation configuration.

## Why Inngest

Inngest gives us workflow primitives that map well to the task requirements:

* background event processing
* per-job concurrency control
* step-based workflow structure
* sleep/delay support
* event-based cancellation
* local development observability through Inngest Dev Server

This allows the application code to focus on the business state of jobs instead of implementing a custom queue system from scratch.

## Alternatives Considered

### Manual in-memory queue

Pros:

* fewer dependencies
* easy to understand for a small task

Cons:

* custom concurrency handling
* custom cancellation handling
* custom retry/error behavior
* less observability
* more edge cases in application code

### BullMQ with Redis

Pros:

* production-proven queue system
* good retry and background job support

Cons:

* requires Redis
* heavier infrastructure for this task
* the task explicitly says that in-memory storage is enough

### setTimeout-based background processing

Pros:

* very simple
* no extra runtime service

Cons:

* poor structure for workflow logic
* hard to document as a scalable architecture
* more risk of race conditions
* not ideal for cancellation and observability

## Consequences

Positive consequences:

* clearer async architecture
* less custom queue code
* better local observability
* concurrency behavior is explicit
* cancellation is documented as part of the workflow

Tradeoffs:

* one additional dependency
* local development requires Inngest Dev Server
* cancellation still requires stale update guards
* in-memory storage is still not production persistent

## Production Notes

For a production version, the current architecture could be extended with:

* PostgreSQL for persistent job storage
* managed Inngest environment for durable background execution
* authentication and rate limiting
* structured logging
* metrics and tracing
* retry policies based on URL check failure type
