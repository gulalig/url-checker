# Architecture

## Overview

The backend is a NestJS application that exposes a REST API and delegates background URL processing to Inngest.

The API is responsible for creating jobs, returning job state and handling cancellation. Inngest is responsible for asynchronous URL checks, concurrency control and delayed result saving.

## Main Flow

```txt
Client
  -> NestJS Jobs API
  -> JobsService
  -> JobsRepository
  -> Inngest event per URL
  -> Inngest check-url function
  -> HTTP HEAD request
  -> random delay
  -> save result
```

## Modules

```txt
src/
  common/
    shared constants

  logger/
    application logger configuration

  jobs/
    REST API, business logic, in-memory repository and response mapping

  inngest/
    Inngest client, function registration and background URL check function
```

## Jobs Module

The jobs module owns the main business logic.

```txt
jobs.controller.ts
  Handles REST endpoints.

jobs.service.ts
  Orchestrates job creation, job listing, cancellation and URL result updates.

jobs.repository.ts
  Stores jobs in memory and handles state transitions.

job-response.mapper.ts
  Converts internal job state into API responses.
```

## Inngest Module

The Inngest module owns background processing.

```txt
inngest.client.ts
  Creates the Inngest SDK client.

inngest-functions.service.ts
  Registers available Inngest functions.

functions/check-url.function.ts
  Processes one URL check event.
```

Each URL is processed by a separate Inngest event. This keeps the job processing scalable and allows concurrency to be controlled per job.

## Concurrency

The assignment requires a maximum of 5 simultaneous URL checks per job.

This is handled by Inngest function concurrency:

```txt
limit: 5
key: event.data.jobId
```

This means different jobs can run concurrently, while each individual job is limited to 5 active URL checks.

## Cancellation

When a job is cancelled:

1. The job status becomes `cancelled`.
2. Pending and in-progress URL checks are marked as `cancelled`.
3. A cancellation event is sent to Inngest.
4. Background functions check job state before saving a result.
5. Stale results are ignored if the job was cancelled.

## Storage

The application uses an in-memory repository based on `Map`.

This keeps the implementation simple and matches the assignment requirements. The repository is isolated behind `JobsRepository`, so it can later be replaced with a database implementation.

## Testing Strategy

The backend has three test levels:

```txt
Unit tests
  Small isolated tests for DTOs, mappers, repository, controller and service.

Integration tests
  JobsService with real JobsRepository and mocked Inngest.

API e2e tests
  Real HTTP requests against the NestJS application.
```
