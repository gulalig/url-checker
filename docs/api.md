# API Documentation

## Overview

The backend exposes a REST API for creating and monitoring asynchronous URL check jobs.

Base URL:

```txt
http://localhost:3000
```

API prefix:

```txt
/api
```

---

## Job Statuses

A job can have one of the following statuses:

| Status        | Description                                              |
| ------------- | -------------------------------------------------------- |
| `pending`     | Job was created, but URL processing has not started yet. |
| `in_progress` | At least one URL check is currently being processed.     |
| `completed`   | All URL checks reached a final state.                    |
| `cancelled`   | Job was cancelled by the user.                           |
| `failed`      | Unexpected internal processing error happened.           |

---

## URL Check Statuses

A URL check can have one of the following statuses:

| Status        | Description                                                       |
| ------------- | ----------------------------------------------------------------- |
| `pending`     | URL check was created, but has not started yet.                   |
| `in_progress` | URL check is currently running.                                   |
| `success`     | HTTP HEAD request completed successfully.                         |
| `error`       | HTTP HEAD request failed or returned an unexpected network error. |
| `cancelled`   | URL check was cancelled because the parent job was cancelled.     |

---

## POST `/api/jobs`

Creates a new asynchronous URL check job.

### Request Body

```json
{
  "urls": [
    "https://example.com",
    "https://github.com"
  ]
}
```

### Validation Rules

* `urls` must be an array.
* `urls` must not be empty.
* Every item must be a valid URL.
* Only `http` and `https` URLs are accepted.

### Success Response

Status code:

```txt
201 Created
```

Body:

```json
{
  "jobId": "6a8b8d4e-8d22-4a8e-97e7-8f4f2f6d4c12"
}
```

### Notes

The endpoint returns immediately after the job is created.

URL checks are processed asynchronously in the background.

---

## GET `/api/jobs`

Returns a list of created jobs with short summary information.

### Success Response

Status code:

```txt
200 OK
```

Body:

```json
[
  {
    "id": "6a8b8d4e-8d22-4a8e-97e7-8f4f2f6d4c12",
    "createdAt": "2026-06-23T10:00:00.000Z",
    "status": "in_progress",
    "total": 3,
    "processed": 1,
    "success": 1,
    "error": 0,
    "cancelled": 0
  }
]
```

### Response Fields

| Field       | Description                      |
| ----------- | -------------------------------- |
| `id`        | Unique job identifier.           |
| `createdAt` | Job creation timestamp.          |
| `status`    | Current job status.              |
| `total`     | Total number of URLs in the job. |
| `processed` | Number of URLs in a final state. |
| `success`   | Number of successful URL checks. |
| `error`     | Number of failed URL checks.     |
| `cancelled` | Number of cancelled URL checks.  |

---

## GET `/api/jobs/:id`

Returns detailed information about a specific job.

### Success Response

Status code:

```txt
200 OK
```

Body:

```json
{
  "id": "6a8b8d4e-8d22-4a8e-97e7-8f4f2f6d4c12",
  "createdAt": "2026-06-23T10:00:00.000Z",
  "status": "completed",
  "total": 2,
  "processed": 2,
  "success": 1,
  "error": 1,
  "cancelled": 0,
  "urls": [
    {
      "url": "https://example.com",
      "status": "success",
      "httpStatus": 200,
      "startedAt": "2026-06-23T10:00:01.000Z",
      "finishedAt": "2026-06-23T10:00:04.000Z",
      "durationMs": 3000
    },
    {
      "url": "https://invalid.example",
      "status": "error",
      "error": "fetch failed",
      "startedAt": "2026-06-23T10:00:01.000Z",
      "finishedAt": "2026-06-23T10:00:03.000Z",
      "durationMs": 2000
    }
  ]
}
```

### Error Response

If the job does not exist:

Status code:

```txt
404 Not Found
```

Body:

```json
{
  "message": "Job not found",
  "error": "Not Found",
  "statusCode": 404
}
```

---

## DELETE `/api/jobs/:id`

Cancels a job.

### Success Response

Status code:

```txt
200 OK
```

Body:

```json
{
  "jobId": "6a8b8d4e-8d22-4a8e-97e7-8f4f2f6d4c12",
  "status": "cancelled"
}
```

### Behavior

When a job is cancelled:

* the job status becomes `cancelled`
* URL checks that have not started yet become `cancelled`
* no new URL checks should be started for that job
* stale background updates must not overwrite cancelled results

### Error Response

If the job does not exist:

Status code:

```txt
404 Not Found
```

If the job is already completed:

Status code:

```txt
409 Conflict
```

---

## Processing Rules

### HTTP Method

Every URL is checked with an HTTP HEAD request.

### Artificial Delay

After the HEAD request finishes, the processor waits for a random delay between 0 and 10 seconds before saving the result.

### Concurrency

No more than 5 URL checks are processed concurrently for the same job.

Different jobs may be processed at the same time.

### Job Failure

URL-level errors do not automatically make the parent job `failed`.

A job becomes `failed` only when an unexpected internal processing error happens.
