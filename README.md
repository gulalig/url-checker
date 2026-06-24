# URL Checker

Fullstack URL Checker application for creating asynchronous URL checking jobs, tracking their progress, inspecting per-URL results, and cancelling active jobs.

The project contains:

* Backend REST API built with NestJS and TypeScript
* Frontend application built with React, TypeScript, Redux Toolkit, Material UI and Vite
* Background URL processing with Inngest
* In-memory job storage

## Stack

### Backend

* Node.js
* TypeScript
* NestJS
* Inngest
* In-memory storage
* Pino logger

### Frontend

* React
* TypeScript
* Vite
* Redux Toolkit
* React Redux
* React Hook Form
* Yup
* Axios
* Material UI

## Requirements

* Node.js 20+
* npm
* Docker and Docker Compose

## Project Structure

```txt
url-checker/
├── backend/              # NestJS REST API and Inngest functions
├── frontend/             # React frontend application
├── docs/                 # Project documentations
├── docker-compose.yml    # Backend Docker setup
└── README.md             # General project documentation
```

## Environment Setup

### Backend

Create a `.env` file inside the `backend` directory:

```bash
cd backend
cp .env.example .env
```

For local backend development, the Inngest dev server runs on `localhost`:

```env
PORT=3000
LOG_LEVEL=debug
LOG_PRETTY=false
FRONTEND_ORIGIN=http://localhost:5173

INNGEST_DEV=1
INNGEST_EVENT_KEY=local
INNGEST_BASE_URL=http://host.docker.internal:8288
```

### Frontend

Create a `.env` file inside the `frontend` directory:

```bash
cd frontend
cp .env.example .env
```

Expected frontend environment:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

The frontend uses relative API paths such as `/jobs`, so the configured base URL must include `/api`.

## Running Backend with Docker

The frontend can still be run locally with `npm run dev`, while the backend runs in Docker.

### 1. Start the Inngest Dev Server Locally

```bash
cd backend
npx inngest-cli@latest dev -u http://localhost:3000/api/inngest
```

### 2. Start the Backend Container

From the project root:

```bash
docker compose up --build
```

Backend API:

```txt
http://localhost:3000/api
```

### 3. Start the Frontend Locally

```bash
cd frontend
npm run dev
```

Frontend:

```txt
http://localhost:5173
```

## API Endpoints

```txt
POST   /api/jobs
GET    /api/jobs
GET    /api/jobs/:id
DELETE /api/jobs/:id
```

### Create Job

```http
POST /api/jobs
Content-Type: application/json
```

```json
{
  "urls": ["https://example.com", "https://github.com"]
}
```

Response:

```json
{
  "jobId": "..."
}
```

### Job Statuses

```txt
pending
in_progress
completed
cancelled
failed
```

### URL Check Statuses

```txt
pending
in_progress
success
error
cancelled
```

## Backend Behavior

* Each job is stored in memory with a unique ID.
* URL checks are processed asynchronously in the background.
* Each URL is checked with an HTTP `HEAD` request.
* A random artificial delay from 0 to 10 seconds is applied before saving each result.
* A maximum of 5 URL checks can run concurrently per job.
* Multiple jobs can be processed at the same time.
* Non-2xx HTTP responses are saved as errors while preserving the HTTP status code.
* Network errors and timeouts are saved as URL check errors.
* Cancelling a job marks pending and in-progress URL checks as cancelled.
* If the background event dispatch fails, the job is marked as failed.

## Frontend Behavior

* Users can create a job by entering one URL per line.
* The created job becomes the active job.
* The jobs list displays recent jobs with status and statistics.
* The active job details page displays progress, statistics and per-URL results.
* The frontend polls the active job while its status is not final.
* Polling stops when the job reaches a final status.
* Polling also stops when the active job changes.
* Outdated responses from a previously selected job are ignored.
* Active jobs can be cancelled from the UI.

## Quality Checks

### Backend

```bash
cd backend
npm run lint
npm run build
npm run test
```

### Frontend

```bash
cd frontend
npm run lint
npm run build
```

## Useful URLs

```txt
Frontend:    http://localhost:5173
Backend API: http://localhost:3000/api
Inngest UI: http://localhost:8288
```

## Notes

* The backend uses in-memory storage, so all jobs are lost after restarting the backend.
* A job may contain more than 5 URLs.
* The concurrency limit applies only to simultaneous URL checks per job, not to the total number of URLs in a job.
* Docker setup is provided for the backend.
* The frontend is intended to be run locally with Vite during development.
