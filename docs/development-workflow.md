# Development Workflow

## Branching

Work is split into small focused branches.

Recommended branch types:

```txt
feature/*
refactor/*
test/*
docs/*
chore/*
```

Examples:

```txt
feature/backend-jobs-api
feature/backend-inngest-processing
refactor/inngest-function-factory
test/backend-unit-tests
docs/update-project-documentation
```

## Commit Style

The project uses short conventional commit messages.

Examples:

```txt
feat(jobs): add jobs api endpoints
feat(inngest): add background url processing
refactor(inngest): move check url function to factory
test(backend): add unit integration and e2e tests
docs: update project documentation
```

## Local Development

Install dependencies:

```bash
cd backend
npm install
```

Create environment file:

```bash
cp .env.example .env
```

Run backend:

```bash
npm run start:dev
```

Run Inngest Dev Server in a separate terminal:

```bash
npx inngest-cli@latest dev -u http://localhost:3000/api/inngest
```

## Quality Checks

Before committing backend changes, run:

```bash
npm run test
npm run test:e2e
npm run lint
npm run build
```

## Testing Levels

```txt
Unit tests
  Test isolated logic such as DTO validation, mappers, repository, controller and service behavior.

Integration tests
  Test JobsService with the real JobsRepository and mocked Inngest.

E2E tests
  Test the REST API through real HTTP requests.
```

## Manual API Testing

Example create job request:

```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"urls":["https://example.com","https://github.com"]}'
```

Example get jobs request:

```bash
curl http://localhost:3000/api/jobs
```

Example cancel job request:

```bash
curl -X DELETE http://localhost:3000/api/jobs/<jobId>
```
