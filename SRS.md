# Software Requirements Specification (SRS)
MERN Task App
Version: 1.0
Date: 2025-11-15

## 1. Introduction

### 1.1 Purpose
Define what the Task App must do (functional and non-functional), how the frontend and backend interact, the API contract, data models, and success criteria. This SRS guides implementation, testing, and interviews.

### 1.2 Scope
A personal task manager with user authentication and CRUD operations over tasks. Users can:
- Register and log in
- Create, read, update, and delete tasks
- Search/filter tasks client-side
- View/edit tasks inside a modal

### 1.3 Definitions, Acronyms
- MERN: MongoDB, Express.js, React, Node.js
- CRUD: Create, Read, Update, Delete
- API: Application Programming Interface (HTTP REST endpoints)
- Context: React Context API for shared client state
- ObjectId: MongoDB 24-char hex identifier (_id)

### 1.4 References
- Project structure in Backend/ and Frontend/ (see repo)
- Express, Mongoose, React, Vite official docs

---

## 2. Overall Description

### 2.1 Product Perspective
Client–server SPA:
- Frontend: React + Vite (dev server at http://localhost:5173)
- Backend: Node.js + Express (API at http://localhost:4500/api/v1)
- Database: MongoDB Atlas (accessed via Mongoose)

System context (dev):
Browser (React) → axios → Express → Mongoose → MongoDB
MongoDB → Mongoose → Express → JSON → Browser → React state update

### 2.2 User Classes
- Authenticated user: manages only their own tasks.

### 2.3 Operating Environment
- Dev: macOS, Node 18+, modern browser, Atlas access
- Prod (future): Static frontend build + hosted Express API + Atlas

### 2.4 Design and Implementation Constraints
- Dev auth via request header user: <userId> (simplified)
- CORS must allow the frontend origin
- Network access to MongoDB Atlas
- Use _id (Mongo) on the wire, not Mongoose’s virtual id unless transformed

### 2.5 Assumptions and Dependencies
- Users exist and are identified by a valid ObjectId
- Base URL in axiosClient points to backend
- Tailwind classes available for UI styles

---

## 3. System Features (Functional Requirements)

ID | Feature | Description | Priority
---|---|---|---
FR-1 | Register/Login | Register a new user; login and store user id in localStorage | High
FR-2 | Auth Guard | Block protected routes if not logged in (ProtectedLayout) | High
FR-3 | Create Task | Add a task with title, description, category | High
FR-4 | List Tasks | Fetch all tasks for the logged-in user | High
FR-5 | View Task | Fetch one task by id and show in modal | High
FR-6 | Update Task | Edit title, description, category | High
FR-7 | Delete Task | Delete a task the user owns | High
FR-8 | Search | Client-side search by title/description/category | Medium
FR-9 | UI State | Loading/error toasts, modal UX | Medium

Behavioral notes:
- Use optimistic UI where possible (addTaskLocal/removeTask)
- Keep consistent response shapes
- Validate ObjectId on backend; return proper status codes

---

## 4. External Interface Requirements

### 4.1 User Interface
- Navbar: app name, Add Task, Logout
- Dashboard: search bar; grid of TaskCard components
- Modal: TaskView for details; TaskUpdateView for editing; delete in read view
- Add Task Page: form with validation
- Footer: Copyright @YYYY fixed or flex-pushed to bottom

### 4.2 REST API (Express)
Base: http://localhost:4500/api/v1
Auth header for protected routes:
- Header: user: <userId string>

Endpoints:
- POST /register
  Req: { name, email, password }
  Res: 201 { message, user: { _id, name, email } } | 400 { error }
- POST /login
  Req: { email, password }
  Res: 200 { message, user: { _id, name, email } } | 401/400 { error }
- Middleware (applies below)
  Reads headers.user; loads user; attaches req.user or returns 401.
- GET /profile
  Res: 200 { user: { _id, name, email } }
- GET /all-task
  Res: 200 { tasks: Task[] }
- POST /add-task
  Req: { title, description, category }
  Res: 201 { message, task: Task } | 400 { error }
- GET /task/:id
  Res: 200 Task | 404 { error } | 400 { error: 'Invalid task id' }
- PUT /task/:id
  Req: { title, description, category }
  Res: 200 { message } | 404 | 400
- DELETE /task/:id
  Res: 200 { message, id } | 404 | 400

Consistency rules:
- Lists are wrapped: { tasks: [...] }
- Create returns { task } plus message
- Errors use { error: string }

---

## 5. Data Requirements (Models)

### 5.1 User (Mongoose)
- _id: ObjectId
- name: String (required)
- email: String (unique, required)
- password: String (hashed in real apps; dev simplification acceptable)
- createdAt, updatedAt: Date

### 5.2 Task (Mongoose)
- _id: ObjectId
- title: String (required)
- description: String (required)
- category: String ('work'|'personal'|'other')
- user: ObjectId (ref User, required)
- createdAt, updatedAt: Date

Validation rules:
- title/description non-empty strings
- category in allowed set
- user is a valid ObjectId (set by middleware)
- For :id params, validate with mongoose.isValidObjectId

---

## 6. System Architecture and Data Flow

### 6.1 Components and Responsibilities
- Frontend
  - Context (MainContext.jsx): tasks[], fetchAllTasks(), addTaskLocal(), removeTask()
  - Pages: Dashboard (list + search), AddTaskPage (form)
  - Components: TaskCard (summary), TaskView (modal + fetch one), TaskViewChild (read + delete), TaskUpdateView (edit)
  - axiosClient: baseURL and headers per request
- Backend
  - routes.js: auth, task/user routes; validation; responses
  - model/*.model.js: Mongoose schemas
  - db.config.js: Mongo connection
  - app.js/index.js: Express bootstrap

### 6.2 Typical Flow (Mental Model)
1) UI need → 2) State location → 3) API contract → 4) Backend validate/query → 5) Frontend axios call → 6) Update Context → 7) Re-render components

### 6.3 End-to-End Flows

Add Task:
- Frontend: AddTaskPage → onSubmit → axios.post('/add-task', body, { headers: { user } })
- Backend: validate → TaskModel.create({ ...body, user: req.user }) → 201 { message, task }
- Frontend: addTaskLocal(task) for instant UI, toast success, optional fetchAllTasks()

List Tasks:
- Frontend: Context fetchAllTasks() → axios.get('/all-task', { headers: { user } })
- Backend: TaskModel.find({ user: req.user }) → 200 { tasks }
- Frontend: setTasks(tasks) → Dashboard renders TaskCard[]

View Task:
- Frontend: TaskView opens → axios.get(`/task/${id}`, { headers: { user } })
- Backend: validate id → findOne({ _id: id, user }) → 200 task
- Frontend: show details in modal

Update Task:
- Frontend: TaskUpdateView → axios.put(`/task/${id}`, body, { headers: { user } })
- Backend: validate id/body → findOneAndUpdate(...) → 200 { message }
- Frontend: close modal; update local state or fetchAllTasks()

Delete Task:
- Frontend: TaskViewChild → axios.delete(`/task/${id}`, { headers: { user } })
- Backend: validate id → findOneAndDelete(...) → 200 { message, id }
- Frontend: removeTask(id) (optimistic), close modal, optional fetchAllTasks()

---

## 7. State Management (Frontend)

- tasks: Task[] (Context)
- fetchAllTasks(): sets tasks from GET /all-task
- addTaskLocal(task): setTasks([task, ...prev])
- removeTask(id): setTasks(prev.filter(t => t._id !== id))
- Error handling: toast.error(error.response?.data?.error || error.message)
- Loading flags in components for UX

---

## 8. Non-Functional Requirements

NFR-1 Security
- Dev: header-based user id; future: JWT, hashed passwords, authorization checks on all routes.

NFR-2 Reliability/Robustness 
- Validate ObjectId; return 400/404 appropriately
- Guard undefined client props (id) before calling API

NFR-3 Performance
- Client search runs on normalized strings with minimal recomputation (useMemo)
- Avoid redundant toLowerCase calls in loops

NFR-4 Usability
- Responsive layout, clear modals, accessible controls, toast feedback

NFR-5 Maintainability
- Consistent API shapes; separation of concerns; centralized Context for shared state

NFR-6 Portability
- Node 18+, modern browsers; Atlas connectivity

NFR-7 Observability
- Console logs/morgan in dev; clear error messages in JSON

---

## 9. Error Handling and Status Codes

- 201 Created: successful POST /add-task
- 200 OK: successful GET/PUT/DELETE
- 400 Bad Request: invalid input or invalid ObjectId
- 401 Unauthorized: no/invalid user header (future JWT)
- 404 Not Found: resource missing or not owned by user

Error body: { error: string }
Client should prefer error.response?.data?.error or fallback to error.message.

---

## 10. Constraints, Risks, and Assumptions

Constraints:
- Dev uses two servers: Vite 5173, Express 4500
- CORS configured to allow frontend origin

Risks:
- Using _id vs id mismatch on client
- /task/undefined if id prop not passed
- Inconsistent JSON shapes causing UI bugs

Assumptions:
- Login stores user id in localStorage
- All task routes require valid user

---

## 11. Acceptance Criteria

- User can register and login; profile returns the correct user
- Dashboard shows only current user’s tasks after GET /all-task
- Add task returns 201 with created task; UI adds card without full page refresh
- View task loads correct data in modal via /task/:id
- Update task persists changes and reflects in UI
- Delete task removes card immediately; DB reflects deletion
- Search filters by title/description/category, case-insensitive
- Invalid ids return 400; missing tasks return 404 with JSON error

---

## 12. Development and Deployment Notes

Dev (macOS):
- Backend: `cd Backend && npm i && npm run dev` (nodemon at :4500)
- Frontend: `cd Frontend && npm i && npm run dev` (Vite at :5173)
- Ensure axiosClient baseURL is http://localhost:4500/api/v1

Prod (future):
- Frontend: `npm run build` → serve /dist via CDN or Express static
- Backend: `npm start` on a host (Render/Railway), configure env and CORS
- Use JWT instead of header-based user id

---

## 13. File Responsibilities and Interactions (Quick Map)

Backend/
- index.js: boot server; connect DB
- src/app.js: create Express app; middleware; mount routes
- src/db.config.js: Mongoose connect
- src/model/user.model.js: User schema/model
- src/model/task.model.js: Task schema/model
- src/routes.js: auth + task CRUD, validation, response shaping

Frontend/
- src/main.jsx: boot React
- src/App.jsx: Router, Context, layout
- src/context/MainContext.jsx: tasks state, fetchAllTasks, addTaskLocal, removeTask
- src/utils/axiosClient.js: axios baseURL and headers usage
- src/utils/constant.js: taskCategories class maps
- src/layout/ProtectedLayout.jsx: auth guard
- src/pages/Dashboard.jsx: list + search (filters)
- src/pages/AddTaskPage.jsx: create form; POST /add-task; update state
- src/components/TaskCard.jsx: summary; opens TaskView with id
- src/components/TaskView.jsx: modal; GET one; edit toggle
- src/components/TaskViewChild.jsx: read view; DELETE; remove from state
- src/components/TaskUpdateView.jsx: PUT; update/sync state
- src/components/LoaderButton.jsx: loading button (type="submit" in forms)
- src/components/Footer.jsx: bottom bar (fixed or flex-pushed)

---

## 14. How to Think and Build (Reusable Checklist)

For any feature:
1) Define data needed on screen
2) Decide state location (Context vs local)
3) Write API contract (path, method, payload, response, status codes)
4) Implement backend: validate → DB op → consistent JSON
5) Test endpoint with curl/Postman
6) Wire frontend axios call; update Context (optimistic)
7) Render components; handle loading/errors
8) Verify with Network tab and React DevTools

This SRS is a living document—extend it when adding new features (e.g., completion status, due dates, pagination, JWT auth).