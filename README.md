# URL Checker

## Stack

Backend: NestJS, TypeScript, Inngest, in-memory storage  
Frontend: React, TypeScript, Redux Toolkit, MUI, Vite

## Requirements

Node.js 20+

## Backend setup

```bash
cd backend
npm install
cp .env.example .env
npm run start:dev
```
---
Inngest dev server
```bash
cd backend
npx inngest-cli@latest dev -u http://localhost:3000/api/inngest
```
---
Frontend setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
---
URLs
```bash
Backend API: http://localhost:3000/api
Frontend: http://localhost:5173
Inngest UI: http://localhost:8288
```
API
```bash
POST   /api/jobs
GET    /api/jobs
GET    /api/jobs/:id
DELETE /api/jobs/:id
```
Quality checks

Backend:
```bash
cd backend
npm run test
npm run build
npm run lint
```
Frontend:
```bash
cd frontend
npm run build
npm run lint
```
---
#Notes

The backend uses in-memory storage, so all jobs are lost after restarting the backend.

The maximum number of concurrent HEAD requests is limited to 5 per job.

A job may contain more than 5 URLs. 

The limit applies only to simultaneous URL checks, not to the total number of URLs.

The frontend polls only the currently active job and stops polling when the job reaches a final status.

Old polling responses are ignored if the active job has already changed.
