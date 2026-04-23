# DA219B Fullstack Lab

This project is a fullstack web application for managing student projects with clear ownership, task status, and progress tracking.

## Problem statement
Students often lose overview when several projects run in parallel. This app solves that by collecting projects, tasks, assignees, and priorities in one place.

## Tech stack
- Frontend: React + Vite
- Backend: Express.js + Mongoose
- Database: MongoDB Atlas

## How the system works
The backend exposes a REST API under `/api`. The frontend will consume these endpoints to create, read, update, and delete data.

The application uses a clear backend structure:
- Router: maps HTTP routes
- Controller: handles request logic
- Model: defines database schema and relations

Current data model:
- users
- projects
- tasks

Database relations:
- `projects.ownerId` -> `users._id`
- `tasks.projectId` -> `projects._id`
- `tasks.assignedTo` -> `users._id`

## What is implemented now
- Express server with environment configuration
- MongoDB connection setup through Mongoose
- Centralized JSON error handling
- Full Task CRUD API
- Input validation middleware for Task create/update
- Seed script with realistic data for all 3 collections

Implemented Task routes:
- POST `/api/tasks`
- GET `/api/tasks`
- GET `/api/tasks/:id`
- PUT `/api/tasks/:id`
- DELETE `/api/tasks/:id`

Supported query filters on GET `/api/tasks`:
- `status`
- `projectId`
- `assignedTo`

## What will be implemented next
- Additional relational endpoints that join collections
- One custom endpoint for filtering/statistics
- React UI with list/table, controlled form, edit/delete flow
- Loading and error states in frontend
- Auto-refresh in frontend with proper cleanup in `useEffect`
- Search/filter feature in UI
- ERD image and report-ready documentation in `docs/`

## Project structure
- `frontend/`: React client
- `backend/`: Express API
- `docs/`: ERD and report material

## Setup and run
1. Clone repository.
2. Copy `backend/.env.example` to `backend/.env`.
3. Fill `backend/.env`:
	- `PORT=5000`
	- `MONGODB_URI=<your-atlas-connection-string>`
	- `CORS_ORIGIN=http://localhost:5173`
	- `NODE_ENV=development`
4. Install dependencies:
	- `npm install`
	- `npm install --prefix backend`
5. Start backend:
	- `npm run dev --prefix backend`

## Seed database
Run seed from project root:
- `npm run seed --prefix backend`

This will insert realistic users, projects, and tasks.

## Important note about secrets
Do not commit real credentials.
- `backend/.env` must stay local.
- `backend/.env.example` is committed as template.
