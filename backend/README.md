# URL Checker

Asynchronous URL checking service built with NestJS, TypeScript and Inngest.

The application allows clients to create URL checking jobs, track their progress, inspect per-URL results and cancel running jobs.

## Features

* Create a job with multiple URLs
* Check each URL using HTTP `HEAD`
* Process URL checks asynchronously in the background
* Limit processing to 5 concurrent URL checks per job
* Add a random artificial delay before saving each result
* Cancel pending or running jobs
* Keep job state in memory
* Unit, integration and API e2e tests

## Tech Stack

* Node.js
* TypeScript
* NestJS
* Inngest
* Jest
* class-validator
* Pino logger

## Project Structure

```txt
url-checker/
  backend/
    src/
      common/
      inngest/
      jobs/
      logger/
    package.json

  docs/
    decisions/
    diagrams/
    api.md
    architecture.md
    development-workflow.md
```

## Getting Started

### Install backend dependencies

```bash
cd backend
npm install
```

### Create environment file

```bash
cp .env.example .env
```

For Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### Run backend

```bash
npm run start:dev
```

The API runs on:

```txt
http://localhost:3000/api
```

### Run Inngest Dev Server

In a separate terminal:

```bash
cd backend
npx inngest-cli@latest dev -u http://localhost:3000/api/inngest
```

Inngest UI:

```txt
http://localhost:8288
```

## API Overview

```txt
POST   /api/jobs
GET    /api/jobs
GET    /api/jobs/:id
DELETE /api/jobs/:id
```

More details are available in:

```txt
docs/api.md
```

## Tests

Run all backend tests:

```bash
cd backend
npm run test
```

Run lint:

```bash
npm run lint
```

Run build:

```bash
npm run build
```

The test suite covers:

* DTO validation
* Repository state transitions
* Service business rules
* Controller delegation
* Inngest function registration
* Service integration flow
* API e2e flow

## Notes

This project intentionally uses in-memory storage because the assignment allows it. All jobs are lost when the backend process restarts.

In production, the repository can be replaced with a persistent database without changing the API contract.
