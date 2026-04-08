# TaskFlow

A full-stack task and project management app built with React, Node.js, Express, and MongoDB.

## Features

- **User authentication** — Register/login with JWT-based sessions
- **Projects** — Create, edit, and delete projects with custom colors
- **Kanban board** — Drag tasks through To Do → In Progress → Done
- **Task management** — Set priority (low/medium/high), due dates, and descriptions
- **Overdue detection** — Tasks past their due date are highlighted

## Tech Stack

| Layer     | Technology               |
|-----------|--------------------------|
| Frontend  | React 18, Vite, React Router v6 |
| Backend   | Node.js, Express         |
| Database  | MongoDB, Mongoose        |
| Auth      | JWT, bcryptjs            |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### Installation

**1. Clone the repo**
```bash
git clone https://github.com/YOUR_USERNAME/task-manager.git
cd task-manager
```

**2. Set up the server**
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

**3. Set up the client**
```bash
cd ../client
npm install
npm run dev
```

App runs at `http://localhost:5173`, API at `http://localhost:5000`.

## API Endpoints

| Method | Endpoint              | Description           |
|--------|-----------------------|-----------------------|
| POST   | /api/auth/register    | Register a new user   |
| POST   | /api/auth/login       | Login                 |
| GET    | /api/projects         | Get all projects      |
| POST   | /api/projects         | Create a project      |
| PUT    | /api/projects/:id     | Update a project      |
| DELETE | /api/projects/:id     | Delete a project      |
| GET    | /api/tasks            | Get tasks (filterable)|
| POST   | /api/tasks            | Create a task         |
| PUT    | /api/tasks/:id        | Update a task         |
| DELETE | /api/tasks/:id        | Delete a task         |

## License

MIT
