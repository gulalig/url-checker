# ADR 0001: Use Inngest for Background Processing

## Status

Accepted

## Context

The assignment requires URL checks to run asynchronously after a job is created.

The system must also support:

* background processing
* maximum 5 simultaneous URL checks per job
* artificial random delay before saving each result
* job cancellation
* multiple jobs running at the same time

## Decision

Use Inngest for background URL processing.

Each URL check is represented as a separate Inngest event:

```txt
url-check/requested
```

Each event is handled by the `check-url` function.

The function uses concurrency control by job id:

```txt
limit: 5
key: event.data.jobId
```

Cancellation is handled with a separate event:

```txt
url-check/job.cancelled
```

## Consequences

Positive:

* URL checks run outside the request-response lifecycle
* concurrency is controlled per job
* cancellation maps naturally to Inngest events
* each URL check can be retried or inspected separately
* the API stays fast and simple

Trade-offs:

* local development requires the Inngest Dev Server
* background processing depends on the Inngest endpoint being available
* production deployment would need proper Inngest signing and configuration

## Alternatives Considered

### In-process Promise queue

Rejected because cancellation, concurrency and observability would require custom queue logic.

### BullMQ / Redis queue

Valid option, but heavier for this assignment because it requires Redis and more infrastructure.

### Cron-based polling

Rejected because it is less reactive and does not fit immediate job processing well.
