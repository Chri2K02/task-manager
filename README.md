# TaskFlow

A full-stack project management app with a drag-and-drop kanban board, real-time task tracking, and team-ready auth.

**[Live Demo →](https://task-manager-mu-black-53.vercel.app)**

---

## Features

- **Kanban board** — drag and drop tasks between To Do, In Progress, and Done
- **Project dashboard** — track progress across all projects with live stats
- **Task detail panel** — click any task to open a full edit panel
- **Search** — `Cmd+K` to search tasks across all projects instantly
- **Priority filtering** — filter kanban by High, Medium, or Low priority
- **Keyboard shortcuts** — `N` to add a task, `Cmd+K` to search, `Esc` to close
- **Overdue detection** — tasks past their due date are flagged automatically
- **JWT authentication** — secure register/login with persistent sessions
- **Confirm dialogs** — no accidental deletes
- **Loading skeletons** — smooth loading states throughout
- **Toast notifications** — feedback on every action
- **Fully responsive** — works on mobile and desktop

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| Drag & Drop | @hello-pangea/dnd |
| Icons | Lucide React |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Deployment | Vercel (frontend), Railway (backend) |

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repo
git clone https://github.com/Chri2K02/task-manager.git
cd task-manager

# Start the backend
cd server
npm install
cp .env.example .env
# Add your MONGO_URI and JWT_SECRET to .env
npm run dev

# Start the frontend (new terminal)
cd ../client
npm install
npm run dev
```

App runs at `http://localhost:5173`

### Environment Variables

**Server (`server/.env`):**
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

**Client (`client/.env.local`):**
```
VITE_API_URL=http://localhost:5000
```

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| GET | `/api/tasks` | Get tasks (filterable by project, status, priority) |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

## License

MIT
