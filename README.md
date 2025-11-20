# MERN Task App – Architecture and Walkthrough

A simple MERN stack application to manage tasks with authentication, CRUD, and client-side search.

## Tech Stack
- Frontend: React, Vite, React Router, Context API, Formik + Yup, TailwindCSS, axios
- Backend: Node.js, Express, Mongoose, MongoDB Atlas, dotenv, cors, nodemon
- Database: MongoDB Atlas (cloud)

## High‑Level Architecture
- React SPA (Vite dev server) renders UI on http://localhost:5173
- Express REST API runs on http://localhost:4500 (mounted at /api/v1)
- Express connects to MongoDB Atlas via Mongoose

Data flow:
Browser (React) → HTTP (axios) → Express (routes) → Mongoose → MongoDB
MongoDB → Mongoose → Express (JSON) → HTTP → Browser (setState via Context)

ASCII view:
[React/Vite:5173] --axios--> [Express:4500] --Mongoose--> [MongoDB Atlas]
[React state ←——————— JSON response ←——————— Express controller]

## Folder Structure (top level)
- Backend/
  - .env
  - index.js
  - package.json
  - src/
    - app.js
    - db.config.js
    - routes.js
    - model/
      - task.model.js
      - user.model.js
- Frontend/
  - index.html
  - package.json
  - vite.config.js
  - src/
    - main.jsx
    - App.jsx
    - App.css, index.css
    - components/
      - Footer.jsx
      - LoaderButton.jsx
      - LoaderComponent.jsx
      - Logo.jsx
      - Navbar.jsx
      - TaskCard.jsx
      - TaskUpdateView.jsx
      - TaskView.jsx
      - TaskViewChild.jsx
    - context/
      - MainContext.jsx
    - layout/
      - ProtectedLayout.jsx
    - pages/
      - AddTaskPage.jsx
      - Dashboard.jsx
      - errorPage.jsx
      - loginPage.jsx
      - Register.jsx
    - utils/
      - axiosClient.js
      - constant.js
  - public/

---

## Backend – File by File

### Backend/.env
- Holds environment variables:
  - MONGO_URI=mongodb+srv://...
  - PORT=4500
- Loaded by dotenv; never commit real secrets.

### Backend/package.json
- Dependencies and scripts.
- Scripts:
  - dev: nodemon index.js (auto-restart in dev)
  - start: node index.js (prod-like run)

### Backend/index.js
- Entry point. Responsibilities:
  - Load env (dotenv)
  - Connect to MongoDB (ConnectDB from src/db.config.js)
  - Create and start Express server
  - Import app from src/app.js and call app.listen(PORT)

How it fits: boots the backend and DB connection.

### Backend/src/app.js
- Builds the Express app:
  - Applies middleware: cors, express.json()
  - Mounts routes: app.use('/api/v1', require('./routes'))
- Exported to index.js

How it fits: centralizes API wiring and middleware.

### Backend/src/db.config.js
- Mongoose connection helper:
  - mongoose.connect(process.env.MONGO_URI)
  - Logs “Database connected successfully”
- Exported as ConnectDB

How it fits: keeps DB connection concerns isolated.

### Backend/src/model/user.model.js
- Mongoose schema/model for users (e.g., name, email, password hash)
- Exports UserModel
- Used in routes for register/login/profile

### Backend/src/model/task.model.js
- Mongoose schema/model for tasks:
  - title, description, category, user (ObjectId ref), timestamps
- Exports TaskModel
- Used across CRUD task routes

### Backend/src/routes.js
- All API endpoints:
  - POST /register – create user
  - POST /login – authenticate; you store user id in localStorage (simple dev approach)
  - Auth middleware – reads req.headers.user; loads/validates user; sets req.user
  - GET /profile – returns current user
  - GET /all-task – returns { tasks: [...] } for req.user
  - POST /add-task – creates a task and returns { message, task }
  - GET /task/:id – returns one task scoped to req.user
  - PUT /task/:id – updates a task
  - DELETE /task/:id – deletes a task
- Good practice: validate ObjectId with mongoose.isValidObjectId, return 400 for invalid id, 404 for not found.

How it fits: defines the contract the frontend calls.

---

## Frontend – File by File

### Frontend/index.html
- HTML shell Vite serves. React mounts into <div id="root">.

### Frontend/vite.config.js
- Vite dev server/build config. Enables fast HMR in dev.

### Frontend/src/main.jsx
- Bootstraps React and renders <App /> into #root.

### Frontend/src/App.jsx
- App composition:
  - Wraps app with BrowserRouter and MainContextProvider
  - Renders Navbar at top, Footer at bottom
  - Routes:
    - ProtectedLayout → '/' (Dashboard) and '/add-task'
    - Public: '/login', '/register', '/*' (error page)
- Often wrapped with min-h-screen flex flex-col so Footer can sit at bottom.

### Frontend/src/context/MainContext.jsx
- Global app state for tasks (and possibly user):
  - const [tasks, setTasks] = useState([])
  - fetchAllTasks(): GET /all-task → setTasks()
  - removeTask(id): optimistic local removal after DELETE
  - addTaskLocal(task): optimistic add after POST
- Exposes these via context so any component can use useMainContext().

How it fits: single source of truth for the task list; avoids prop drilling.

### Frontend/src/utils/axiosClient.js
- Preconfigured axios:
  - baseURL: http://localhost:4500/api/v1
  - You pass the user header per request:
    headers: { user: localStorage.getItem('user') || '' }

### Frontend/src/utils/constant.js
- taskCategories: category → Tailwind class string
- Centralizes visual style for category pills (work/personal/other).

### Frontend/src/layout/ProtectedLayout.jsx
- Route guard:
  - If no localStorage.user → redirect to /login
  - Else render <Outlet />
- Ensures only authenticated users hit task routes.

### Frontend/src/components/Navbar.jsx
- Logo, Add Task, Logout
- Logout clears localStorage and navigates to /login.

### Frontend/src/components/Footer.jsx
- Sticky footer:
  - fixed bottom-0 or use layout flex strategy with mt-auto.

### Frontend/src/components/TaskCard.jsx
- Displays a task summary:
  - Title, description snippet, category pill
  - Renders <TaskView id={task._id} /> to open modal

### Frontend/src/components/TaskView.jsx
- Modal for viewing/updating a single task:
  - fetchData() GET /task/:id on open
  - isUpdate flag to toggle between read and edit modes
  - Renders TaskViewChild (read) or TaskUpdateView (edit)
  - close() handler to dismiss modal

### Frontend/src/components/TaskViewChild.jsx
- Read‑only view of a task inside the modal
- Delete button:
  - DELETE /task/:id
  - On success: removeTask(id) from context (instant UI), optionally fetchAllTasks(), close()

### Frontend/src/components/TaskUpdateView.jsx
- Edit form for a task:
  - PUT /task/:id with updated { title, description, category }
  - On success: either update context or fetchAllTasks(), then close()

### Frontend/src/components/LoaderButton.jsx
- Button that shows a loading state
- Must forward type="submit" inside forms

### Frontend/src/components/LoaderComponent.jsx
- Spinner / loading indicator component

### Frontend/src/pages/Dashboard.jsx
- Pulls tasks from context
- Search box filters by title/description/category (normalize with trim().toLowerCase())
- Maps filtered list to <TaskCard key={_id} data={task} />

### Frontend/src/pages/AddTaskPage.jsx
- Formik + Yup validation for title, description, category
- On submit:
  - POST /add-task with { user } header
  - On success:
    - If API returns created task → addTaskLocal(task) (optimistic)
    - Else → fetchAllTasks()
  - Reset form and toast success

### Frontend/src/pages/loginPage.jsx and Register.jsx
- Auth forms
- On success, store user id in localStorage as "user" (simple dev flow)

### Frontend/src/pages/errorPage.jsx
- 404-like fallback

---

## Request–Response Cycles (End‑to‑End)

### 1) Add Task
- Frontend:
  - User submits AddTaskPage form → axiosClient.post('/add-task', formData, { headers: { user } })
- Backend:
  - routes.js → POST /add-task
  - Auth middleware sets req.user from header
  - Validate body; TaskModel.create({ ...formData, user: req.user })
  - Respond 201 { message: 'Task added successfully', task }
- Frontend:
  - If res.data.task present → addTaskLocal(task) (instant card without refresh)
  - Else → fetchAllTasks()
  - Toast success; reset form

### 2) List Tasks (Dashboard or after actions)
- Frontend:
  - fetchAllTasks() → axiosClient.get('/all-task', { headers: { user } })
- Backend:
  - GET /all-task → TaskModel.find({ user: req.user })
  - Respond 200 { tasks: [...] }
- Frontend:
  - setTasks(tasks); Dashboard maps to TaskCard

### 3) View One Task
- Frontend:
  - TaskView opens → axiosClient.get(`/task/${id}`, { headers: { user } })
- Backend:
  - Validate id; findOne({ _id: id, user: req.user })
  - Respond 200 task (or 404)
- Frontend:
  - Show full details in modal

### 4) Update Task
- Frontend:
  - TaskUpdateView → axiosClient.put(`/task/${id}`, body, { headers: { user } })
- Backend:
  - Validate id/body; findOneAndUpdate({ _id: id, user: req.user }, body)
  - Respond 200 { message: 'Task updated successfully' } (optionally return updated task)
- Frontend:
  - Close modal; either update local state or fetchAllTasks()

### 5) Delete Task
- Frontend:
  - TaskViewChild → axiosClient.delete(`/task/${id}`, { headers: { user } })
- Backend:
  - Validate id; findOneAndDelete({ _id: id, user: req.user })
  - Respond 200 { message: 'Task deleted successfully', id }
- Frontend:
  - removeTask(id) (optimistic) → card disappears; optionally fetchAllTasks()

---

## Why some actions needed refresh (and the fix)
- If you only mutate the DB but don’t update the client state, the UI won’t reflect changes until a refetch.
- Use optimistic updates in Context:
  - addTaskLocal(task) after POST
  - removeTask(id) after DELETE
- Optionally run fetchAllTasks() in background to re-sync.

---

## How to Run Locally (macOS)
- Backend:
  - cd Backend
  - npm install
  - Create .env with MONGO_URI and PORT=4500
  - npm run dev
- Frontend:
  - cd Frontend
  - npm install
  - npm run dev
  - Open http://localhost:5173

Ensure axiosClient baseURL points to http://localhost:4500/api/v1

---

## Interview‑Ready Summary

- Tech stack:
  - MERN: React (Vite), Node/Express, MongoDB (Atlas), Mongoose, Tailwind, Formik/Yup, axios.
- Architecture:
  - Client–server SPA. React calls a REST API. The API uses Mongoose to persist to MongoDB.
  - Client state centralized via Context for tasks; optimistic updates + background refetch.
- Key features:
  - Auth (simple header-based for dev), CRUD for tasks, client-side search, modal-driven view/edit, sticky footer, responsive UI.
- Why this stack:
  - One language (JavaScript) across client and server.
  - Fast iteration (Vite HMR, nodemon).
  - MongoDB’s flexible schema fits tasks; Mongoose speeds modeling/validation.
- What I learned:
  - Difference between dev asset server (Vite) and application server (Express).
  - Full request/response lifecycle, status codes, and error handling (400 invalid id, 404 not found, 201 created).
  - Handling ObjectId (_id vs id), avoiding /task/undefined, and keeping API response shapes consistent.
  - State management tradeoffs: optimistic UI vs refetch; using Context to avoid prop drilling.
  - Practical debugging: Network tab, React DevTools, logging ids, validating ObjectId.

---