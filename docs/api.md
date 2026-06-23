# API

Base URL:

```txt
http://localhost:3000/api
```

## Create Job

```http
POST /jobs
```

Request:

```json
{
  "urls": [
    "https://example.com",
    "https://github.com"
  ]
}
```

Response:

```json
{
  "jobId": "job-id"
}
```

Validation rules:

* `urls` must be an array
* `urls` must contain at least one item
* each URL must include `http://` or `https://`

## List Jobs

```http
GET /jobs
```

Response:

```json
[
  {
    "id": "job-id",
    "createdAt": "2026-06-23T10:00:00.000Z",
    "status": "pending",
    "total": 2,
    "processed": 0,
    "success": 0,
    "error": 0,
    "cancelled": 0
  }
]
```

## Get Job Details

```http
GET /jobs/:id
```

Response:

```json
{
  "id": "job-id",
  "createdAt": "2026-06-23T10:00:00.000Z",
  "status": "completed",
  "total": 2,
  "processed": 2,
  "success": 1,
  "error": 1,
  "cancelled": 0,
  "urls": [
    {
      "id": "url-check-id",
      "url": "https://example.com",
      "status": "success",
      "httpStatus": 200,
      "startedAt": "2026-06-23T10:00:01.000Z",
      "finishedAt": "2026-06-23T10:00:05.000Z",
      "durationMs": 4000
    },
    {
      "id": "url-check-id",
      "url": "https://invalid.example",
      "status": "error",
      "error": "fetch failed",
      "startedAt": "2026-06-23T10:00:01.000Z",
      "finishedAt": "2026-06-23T10:00:05.000Z",
      "durationMs": 4000
    }
  ]
}
```

## Cancel Job

```http
DELETE /jobs/:id
```

Response:

```json
{
  "jobId": "job-id",
  "status": "cancelled"
}
```

Cancellation rules:

* Pending URL checks become `cancelled`
* In-progress URL checks become `cancelled`
* Finished URL checks keep their final `success` or `error` status
* Completed jobs cannot be cancelled
* Failed jobs cannot be cancelled

## Job Statuses

```txt
pending
in_progress
completed
cancelled
failed
```

## URL Check Statuses

```txt
pending
in_progress
success
error
cancelled
```

## Error Responses

Invalid payload:

```json
{
  "message": ["each value in urls must be a URL address"],
  "error": "Bad Request",
  "statusCode": 400
}
```

Job not found:

```json
{
  "message": "Job not found",
  "error": "Not Found",
  "statusCode": 404
}
```

Completed job cancellation:

```json
{
  "message": "Completed job cannot be cancelled",
  "error": "Conflict",
  "statusCode": 409
}
```
