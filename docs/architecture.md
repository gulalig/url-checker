# Backend Architecture

## Overview

This backend implements an asynchronous URL checking service.

The API allows users to create URL check jobs, list existing jobs, view detailed job results, and cancel running jobs.

The backend is designed around a clear separation of responsibilities:

* REST API layer
* job lifecycle service
* in-memory repository
* background processing layer
* URL check execution

## High-Level Architecture

```mermaid
flowchart LR
  Client[Frontend Client] --> API[NestJS REST API]

  API --> JobsService[Jobs Service]
  JobsService --> Repo[In-memory Jobs Repository]

  JobsService --> InngestClient[Inngest Client]
  InngestClient --> Inngest[Inngest Dev Server]

  Inngest --> UrlCheckFn[URL Check Function]
  UrlCheckFn --> TargetUrl[External URL via HEAD]
  UrlCheckFn --> Repo
```

## Main Components

### Jobs Controller

The controller exposes the REST API endpoints:

* `POST /api/jobs`
* `GET /api/jobs`
* `GET /api/jobs/:id`
* `DELETE /api/jobs/:id`

The controller should stay thin and delegate business logic to `JobsService`.

### Jobs Service

The service owns the job lifecycle.

Responsibilities:

* create jobs
* validate incoming URLs
* send URL check events to Inngest
* return job summaries
* return job details
* cancel jobs
* update job and URL statuses
* recalculate parent job status after URL result changes

### Jobs Repository

The repository is an in-memory storage abstraction based on `Map`.

It stores:

* job metadata
* URL check records
* job status
* URL check status
* timestamps
* HTTP status codes
* error messages
* duration values

The repository abstraction keeps storage details outside the controller and background functions.

### Inngest Client

The Inngest client is used to publish background events.

When a job is created, the backend sends one event per URL. This creates a fan-out processing model where every URL check has its own background execution unit.

### URL Check Function

The URL check function is triggered by a URL check event.

Responsibilities:

1. Check whether the job exists.
2. Check whether the job has already been cancelled.
3. Mark the URL check as `in_progress`.
4. Perform an HTTP HEAD request.
5. Wait for a random artificial delay between 0 and 10 seconds.
6. Save the final URL result.
7. Recalculate the parent job status.

## Job Creation Flow

```mermaid
sequenceDiagram
  participant UI as Frontend
  participant API as NestJS API
  participant Service as JobsService
  participant Repo as JobsRepository
  participant Inngest as Inngest

  UI->>API: POST /api/jobs
  API->>Service: createJob(urls)
  Service->>Repo: save job with pending status
  Service->>Inngest: send one event per URL
  API-->>UI: { jobId }

  Inngest->>Service: process URL check event
  Service->>Repo: mark URL as in_progress
  Service->>Service: perform HEAD request
  Service->>Service: wait random delay
  Service->>Repo: save result
  Service->>Repo: update job status
```

## URL Check Processing Flow

```mermaid
flowchart TD
  A[URL check event received] --> B{Job exists?}
  B -- No --> X[Skip processing]
  B -- Yes --> C{Job cancelled?}

  C -- Yes --> D[Mark URL as cancelled]
  C -- No --> E[Mark URL as in_progress]

  E --> F[Perform HTTP HEAD request]
  F --> G{HEAD succeeded?}

  G -- Yes --> H[Store HTTP status]
  G -- No --> I[Store error message]

  H --> J[Random delay 0-10 seconds]
  I --> J

  J --> K{Job cancelled before saving?}
  K -- Yes --> L[Keep URL cancelled]
  K -- No --> M[Save success or error result]

  L --> N[Recalculate job status]
  M --> N
```

## Cancellation Flow

```mermaid
sequenceDiagram
  participant UI as Frontend
  participant API as NestJS API
  participant Service as JobsService
  participant Repo as JobsRepository
  participant Inngest as Inngest
  participant Fn as URL Check Function

  UI->>API: DELETE /api/jobs/:id
  API->>Service: cancelJob(jobId)
  Service->>Repo: mark job as cancelled
  Service->>Repo: mark pending URL checks as cancelled
  Service->>Inngest: send job cancelled event
  API-->>UI: cancelled job

  Inngest-->>Fn: cancel matching function runs
  Fn->>Repo: skip stale updates if job is already cancelled
```

## Job State Machine

```mermaid
stateDiagram-v2
  [*] --> pending

  pending --> in_progress: first URL check starts
  pending --> cancelled: DELETE /api/jobs/:id

  in_progress --> completed: all URL checks finished
  in_progress --> cancelled: DELETE /api/jobs/:id
  in_progress --> failed: unexpected internal error

  completed --> [*]
  cancelled --> [*]
  failed --> [*]
```

## URL Check State Machine

```mermaid
stateDiagram-v2
  [*] --> pending

  pending --> in_progress: check started
  pending --> cancelled: parent job cancelled

  in_progress --> success: HEAD request completed
  in_progress --> error: HEAD request failed
  in_progress --> cancelled: parent job cancelled before final save

  success --> [*]
  error --> [*]
  cancelled --> [*]
```

## Concurrency Model

Concurrency is limited per job.

Each URL check is triggered as a separate background event. The URL check function uses a concurrency key based on `jobId`.

This means:

* Job A can process up to 5 URLs at the same time.
* Job B can also process up to 5 URLs at the same time.
* Different jobs do not block each other.
* A single job never exceeds 5 active URL checks.

## Delay Model

Every URL check applies an artificial random delay before saving the final result.

The delay is applied after the HEAD request finishes and before the result is persisted.

This matches the task requirement that the artificial delay must happen before saving the result.

## Error Handling Model

A failed URL check does not mean that the whole job failed.

For example, if one URL returns a network error, this is stored as a URL-level `error` result.

The parent job becomes `completed` when all URL checks finish, even if some URL checks ended with `error`.

The parent job becomes `failed` only if an unexpected internal processing error happens.

## Storage Model

The project uses in-memory storage.

This means:

* data is lost after server restart
* no database migrations are needed
* the implementation stays focused on async processing logic

For a production version, the in-memory repository could be replaced with a persistent database.
