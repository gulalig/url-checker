# URL Checker

Asynchronous URL checking service built with Node.js, TypeScript, NestJS, Inngest, and React.

The project provides a REST API for creating URL check jobs and a frontend application for working with those jobs.

## Project Status

Current implementation stage:

* Backend project initialized
* Architecture documentation prepared
* Inngest-based background processing planned
* Frontend will be added after backend completion

## Tech Stack

### Backend

* Node.js
* TypeScript
* NestJS
* Inngest
* In-memory storage

### Frontend

* TypeScript
* React
* Redux Toolkit

### Infrastructure

* Docker
* Docker Compose

## Main Requirements

The system should support:

* Creating asynchronous URL check jobs
* Listing jobs
* Viewing detailed job results
* Cancelling jobs
* Checking every URL with an HTTP HEAD request
* Applying a random delay before saving each URL result
* Processing no more than 5 URLs concurrently per job
* Processing multiple jobs at the same time

## Repository Structure

```txt
url-checker/
  backend/
    src/

  frontend/
    src/

  docs/
    architecture.md
    api.md
    development-workflow.md

    decisions/
      0001-use-nestjs.md
      0002-use-inngest-for-background-processing.md
      0003-use-in-memory-storage.md

    diagrams/
      backend-flow.md
      job-state-machine.md
      cancellation-flow.md
```

## Backend Architecture

The backend uses NestJS as the REST API layer and Inngest as the background processing layer.

When a job is created, the API saves it in memory and sends one Inngest event for each URL. Each URL is processed asynchronously by an Inngest function.

Concurrency is limited per job, which means that every job can process up to 5 URLs at the same time, while different jobs can still be processed independently.

## Storage

The project uses in-memory storage because the task does not require a database.

This means that all jobs and results are lost after server restart.

For a production version, the storage layer could be replaced with PostgreSQL, Redis, or another persistent storage solution.

## Development

Backend local start:

```bash
cd backend
npm install
npm run start:dev
```

Backend default URL:

```txt
http://localhost:3000
```

## Documentation

Architecture documentation is located in:

```txt
docs/architecture.md
```

Architecture decision records are located in:

```txt
docs/decisions/
```

## Security Audit Note

The project may show an npm audit warning related to transitive dependencies of the NestJS Express platform package.

The implemented API does not expose file upload or multipart/form-data endpoints. For a production system, dependency updates should be reviewed regularly and applied when upstream packages provide patched versions.

## Notes

This repository is prepared as a test assignment implementation. The goal is to keep the implementation simple, readable, and well documented while still showing production-oriented architectural thinking.
