# URL Checker

A fullstack TypeScript application for asynchronous URL checking.

The project allows users to create URL checking jobs, track job progress in real time, inspect per-URL results, and cancel active jobs. Each URL is checked asynchronously with an HTTP `HEAD` request, and the backend limits concurrent URL checks per job.

## Tech Stack

### Backend

* Node.js
* TypeScript
* NestJS
* Inngest
* In-memory storage
* Jest
* ESLint

### Frontend

* React
* TypeScript
* Vite
* Redux Toolkit
* React Hook Form
* Yup
* Axios
* Material UI

## Project Structure

```txt
url-checker/
├── backend/      # NestJS API and asynchronous URL checking logic
├── frontend/     # React application
├── docs/         # Project docs
└── README.md     # General project documentation
```

## Features

### Backend

* Create asynchronous URL checking jobs
* Store jobs and URL check results in memory
* Process URL checks in the background
* Perform HTTP `HEAD` requests
* Add a random artificial delay before saving each result
* Limit concurrent URL checks to 5 per job
* Support multiple jobs running at the same time
* Cancel active jobs and prevent not-started URL checks from running
* Provide list and details endpoints

### Frontend

* Create a job by entering one URL per line
* Show recent jobs with status and statistics
* Select an active job
* Display job progress
* Display per-URL results
* Poll active job details until the job reaches a final status
* Stop old polling correctly when the active job changes
* Cancel active jobs
* Filter URL results by status

## API Endpoints

The backend exposes the following REST endpoints:

```txt
POST   /api/jobs
GET    /api/jobs
GET    /api/jobs/:id
DELETE /api/jobs/:id
```

## Running Locally

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Configure Backend Environment

Create a `.env` file inside `backend`:

```env
PORT=3000
FRONTEND_ORIGIN=http://localhost:5173
```

### 3. Start Backend

```bash
cd backend
npm run start:dev
```

The backend will be available at:

```txt
http://localhost:3000
```

### 4. Start Inngest Dev Server

In a separate terminal, run the Inngest dev server according to the backend documentation.

Backend Inngest endpoint:

```txt
http://localhost:3000/api/inngest
```

For more backend-specific details, see:

```txt
backend/README.md
```

### 5. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 6. Configure Frontend Environment

Create a `.env` file inside `frontend`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 7. Start Frontend

```bash
cd frontend
npm run dev
```

The frontend will be available at:

```txt
http://localhost:5173
```

## Useful Commands

### Backend

```bash
cd backend
npm run build
npm run lint
npm run test
```

### Frontend

```bash
cd frontend
npm run build
npm run lint
```

## Notes

* The backend uses in-memory storage, so all jobs are lost after restarting the backend.
* The maximum number of concurrent `HEAD` requests is limited to 5 per job.
* A job may contain more than 5 URLs. The limit applies only to simultaneous URL checks, not to the total number of URLs.
* The frontend polls only the currently active job and stops polling when the job reaches a final status.
* Old polling responses are ignored if the active job has already changed.
