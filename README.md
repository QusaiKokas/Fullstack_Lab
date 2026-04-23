# DA219B Fullstack Lab

Current status: Day 1 backend foundation is implemented and tested locally.

## Problem statement
A web app for managing student projects with clear ownership, task status, and progress tracking.

## Planned stack
- Frontend: React + Vite
- Backend: Express.js + Mongoose
- Database: MongoDB Atlas

## Folder structure
- frontend/: React app shell
- backend/: Express API, Mongoose models, CRUD routes, and seed script
- docs/: ERD and report assets

## Quick start
1. Copy backend/.env.example to backend/.env and fill values.
2. Install dependencies:
	- npm install
	- npm install --prefix backend
3. Start backend:
	- npm run dev --prefix backend

## Day 1 implemented
- Router -> Controller -> Model pattern for Task API
- Full Task CRUD endpoints
- Input validation middleware for POST and PUT
- Centralized JSON error handling with status codes 400, 404, 409, 500
- Three related collections with ObjectId references:
  - users
  - projects
  - tasks
- Realistic seed script with at least 5 documents per collection

## Backend routes (Task)
- POST /api/tasks
- GET /api/tasks
- GET /api/tasks/:id
- PUT /api/tasks/:id
- DELETE /api/tasks/:id

Filtering supported on GET /api/tasks via query params:
- status
- projectId
- assignedTo

## Seed data
Run from project root:
- npm run seed --prefix backend

Requires a valid backend/.env with MONGODB_URI.
