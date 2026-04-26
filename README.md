# DA219B Fullstack Lab

A fullstack web app I built for managing student projects. You can track your projects, tasks, who's working on what and how things are going.

## What does it solve?
When you have multiple projects going on at the same time it gets hard to keep track of everything. This app puts all your projects, tasks and team members in one place so you don't lose track.

## Tech stack
- **Frontend:** React (Vite)
- **Backend:** Express.js
- **Database:** MongoDB Atlas (Mongoose)

## Data model
Three collections:
- `users` – student info (name, email, study program, role)
- `projects` – project info (title, course code, deadline, owner)
- `tasks` – individual tasks (title, status, priority, due date)

Relations:
- A project has an owner → `projects.ownerId` references `users._id`
- A task belongs to a project → `tasks.projectId` references `projects._id`
- A task is assigned to a user → `tasks.assignedTo` references `users._id`

## API routes

**Tasks (full CRUD):**
- `POST /api/tasks` – create task
- `GET /api/tasks` – get all (supports `?status=`, `?projectId=`, `?assignedTo=` filters)
- `GET /api/tasks/:id` – get one
- `PUT /api/tasks/:id` – update
- `DELETE /api/tasks/:id` – delete

**Projects & Users:**
- `GET /api/projects` – all projects with owner info
- `GET /api/projects/:id` – one project
- `GET /api/users` – all users

**Stats:**
- `GET /api/stats/tasks` – task count per status, avg priority, total hours

All routes return proper error codes (400, 404, 409, 500) with JSON messages.

## Frontend
- Table view of all tasks with sortable columns
- Create/edit form with dropdowns for project and user
- Delete button with confirmation
- Search bar + status filter
- Stats overview cards at the top
- Auto-refreshes every 10 seconds (with cleanup on unmount)
- Shows loading state and error messages

Components: `TaskList`, `TaskRow`, `TaskForm`, `SearchFilter`, `StatsPanel`

## How to run

1. Clone the repo
2. Copy `backend/.env.example` → `backend/.env` and fill in your MongoDB URI:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://your-user:your-pass@cluster.mongodb.net/
   CORS_ORIGIN=http://localhost:5173
   NODE_ENV=development
   ```
3. Install everything:
   ```
   npm install
   npm install --prefix backend
   npm install --prefix frontend
   ```
4. Run:
   ```
   npm run dev
   ```
   This starts both backend and frontend. Open http://localhost:5173

If you don't have a MongoDB Atlas connection you can still run with an in-memory database:
```
npm run dev
```
(The default dev script uses in-memory MongoDB so it works without Atlas)

## Seed data
To populate the database with sample data:
```
npm run seed --prefix backend
```

## Folder structure
```
├── backend/
│   └── src/
│       ├── config/       # db connection
│       ├── controllers/  # route logic
│       ├── middleware/    # error handling, validation
│       ├── models/       # mongoose schemas
│       ├── routes/       # express routers
│       ├── seeds/        # seed script
│       └── tests/        # smoke tests
├── frontend/
│   └── src/
│       ├── components/   # react components
│       ├── App.jsx       # main component
│       └── App.css       # styles
├── docs/
│   └── erd/              # database diagram
└── package.json          # root scripts (concurrently)
```

## Note
Don't commit your `.env` file. It's in `.gitignore`. Use `.env.example` as a template.
