# Frontend

React frontend for the URL Checker application.

The application provides a user interface for creating asynchronous URL checking jobs, viewing recent jobs, tracking active job progress, inspecting per-URL results, filtering URL checks by status, and cancelling active jobs.

## Tech Stack

* React
* TypeScript
* Vite
* Redux Toolkit
* React Redux
* React Hook Form
* Yup
* Axios
* Material UI

## Features

* Create a new URL checking job from a textarea
* Enter one URL per line
* Validate URL format before submitting
* Prevent duplicate URLs
* Send job creation requests to the backend
* Store the created `jobId` as the active job
* Show recent jobs with status and statistics
* Select any job as the active job
* Display detailed information for the active job
* Show job progress as processed URLs out of total URLs
* Show URL status, HTTP status, error message, start time, finish time, and duration
* Poll active job details until the job reaches a final status
* Stop polling when the active job changes
* Ignore outdated responses from previously selected jobs
* Cancel an active job
* Filter URL checks by status
* Paginate job lists and URL check results
* Show loading, empty and error states

## Project Structure

```txt
src/
├── app/          # Application entry point
├── components/   # Reusable UI components
├── constants/    # Shared constants and UI copy
├── features/     # Feature-level UI modules
├── hooks/        # Typed Redux hooks and polling hook
├── schemas/      # Form validation schemas
├── services/     # API client and backend services
├── shared/       # Shared layout and global styles
├── store/        # Redux Toolkit store, slices, thunks and selectors
├── theme/        # Material UI theme and providers
├── types/        # Shared TypeScript types
└── utils/        # Formatting, status, error and form helpers
```

## Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

The frontend uses relative API endpoints such as `/jobs`, so the base URL must include `/api`.

Correct final request example:

```txt
http://localhost:3000/api/jobs
```

## Installation

```bash
npm install
```

## Running the App

```bash
npm run dev
```

The frontend will run on:

```txt
http://localhost:5173
```

## Build

```bash
npm run build
```

This command runs TypeScript project build first and then creates a production Vite build.

## Lint

```bash
npm run lint
```

## Preview Production Build

```bash
npm run preview
```

## Backend Requirement

The backend must be running before using the frontend.

Default backend URL:

```txt
http://localhost:3000
```

Default API base URL:

```txt
http://localhost:3000/api
```

## State Management

The application uses Redux Toolkit for global state management.

The store keeps:

* jobs list
* active job id
* active job details
* loading states
* error states

Async API calls are handled with Redux Toolkit thunks.

## API Layer

All backend communication is separated into the service layer.

The frontend calls the following backend endpoints:

```txt
POST   /jobs
GET    /jobs
GET    /jobs/:id
DELETE /jobs/:id
```

The configured `VITE_API_BASE_URL` is prepended to these endpoints.

## Polling Behavior

The application periodically polls the active job details while the job is not in a final status.

Final job statuses are:

```txt
completed
cancelled
failed
```

When the active job changes, polling for the previous job is stopped. The Redux slice also guards against outdated responses, so a response from an old job cannot overwrite the currently active job state.

## Validation

The job creation form validates that:

* at least one URL is provided
* each URL starts with `http://` or `https://`
* duplicate URLs are not allowed
* each URL is placed on a separate line

Validation is handled with React Hook Form and Yup.

## Testing Notes

Automated frontend unit tests are not included due to the limited time frame of the test assignment.

The project structure allows tests to be added easily later. Good candidates for future unit tests include:

* URL parsing helpers
* duplicate URL detection
* status formatting helpers
* date and duration formatting helpers
* Redux reducers
* Redux async thunk behavior
* form validation schema

Potential testing tools:

* Vitest
* React Testing Library
* MSW for API mocking

## Production Optimization Notes

The current application is small and already benefits from Vite's production build optimization.

If the project grows, additional frontend optimizations can be added:

* route-level lazy loading
* feature-level code splitting
* manual vendor chunk splitting in Vite
* memoization for heavier derived UI data
* API response caching strategy if persistent storage is introduced
* bundle size analysis before production deployment

For example, larger feature modules such as job details or job history pages could be loaded lazily in the future to reduce the initial JavaScript bundle size.

## Notes

* The frontend expects the backend API to be available before creating or loading jobs.
* Job data is stored in memory on the backend, so all jobs are lost after backend restart.
* A job may contain more than 5 URLs. The backend limit applies to concurrent `HEAD` requests per job, not to the total number of URLs.
* URL result filtering is handled on the client side.
* Pagination is handled on the client side.
