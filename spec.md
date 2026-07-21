# 📦 Sprint 1: WarehouseOS Foundation & Auth

**🎯 Sprint Goal:** Establish the technical foundation. No product/inventory logic yet. The sole focus is a secure, containerized app with user authentication and route protection.

### 🛠 Tech Stack Overview

- **Framework:** Next.js (App Router, Route Handlers, Middleware)
- **Auth:** NextAuth.js (Credentials Provider)
- **Database:** MongoDB via Mongoose
- **Validation:** Zod
- **Testing:** Vitest + React Testing Library
- **DevOps:** Docker + GitHub Actions (CI/CD)

---

## 🛑 Rules of the Road (Read First)

- **NO DIRECT DB CALLS FROM REACT:** All DB operations _must_ go through Next.js Route Handlers (API).
- **LINKING:** Use _only_ the Next.js `<Link>` component for navigation.
- **RESPONSIVENESS:** Mobile (≥375px), Tablet (≥768px), Desktop (≥1024px).
- **PASSWORDS:** Must be hashed before saving to MongoDB.

---

## 📋 Task Breakdown

### Phase 1: Database & Models 🗄️

- [ ] Connect Next.js to **MongoDB**.
- [ ] Create the **User Model** using Mongoose.
- **Schema Requirements:**
- `name` (String)
- `email` (String, unique)
- `password` (String, hashed)
- `createdAt` (Date)
- `updatedAt` (Date)

### Phase 2: Global UI & Layouts 🎨

- [ ] Create a **Global Layout** (Header & Footer).
- _Note: This layout should ONLY wrap protected pages, NOT `/login` or `/register`._

- [ ] Build **Header** Component:
- Display "WarehouseOS" Logo.
- Display Dashboard Link.
- Display Current User's Name & Email.
- Display "Logout" button.

- [ ] Build **Footer** Component:
- Display "WarehouseOS" and Current Year.

### Phase 3: Registration (`/register`) 📝

- [ ] Create standard page layout for `/register`.
- [ ] Create **RegisterForm** component with Zod validation.
- `name`: Required, min 3 chars.
- `email`: Required, valid format.
- `password`: Required, min 8 chars.
- `password_confirmation`: Must match password.

- [ ] Create API Route: `POST /api/register`
- Validate incoming data with Zod.
- Check if email already exists (return error if true).
- Hash password.
- Save user to MongoDB.

- [ ] Handle UI success/error states:
- Show validation/server errors directly to the user.
- On success: ➡️ Redirect to `/login`.

### Phase 4: Authentication (`/login`) 🔐

- [ ] Setup **NextAuth.js** with Credentials Provider.
- [ ] Create standard page layout for `/login`.
- [ ] Create **LoginForm** component.
- Fields: `email`, `password`.

- [ ] Handle UI success/error states:
- Show "Incorrect credentials" or server errors if login fails.
- On success: ➡️ Redirect to `/dashboard`.

- [ ] **Type the Session (TypeScript):** Ensure session object includes `id`, `name`, and `email`.

### Phase 5: Dashboard & Protection 🛡️

- [ ] Create **Middleware** (`middleware.ts`).
- Protect `/dashboard` (and make it easy to add future routes).
- Unauthenticated users attempting to access protected routes ➡️ Redirect to `/login`.

- [ ] Create `/dashboard` page:
- Display Welcome Message.
- Display current User Info.
- Display Login Date/Time.
- Display Logout Button.

- [ ] Handle **Logout** logic:
- Destroy session.
- ➡️ Redirect to `/login`.

### Phase 6: Testing 🧪

- [ ] Setup **Vitest** and **React Testing Library**.
- [ ] Write unit test for `RegisterForm` (render + validation).
- [ ] Write unit test for `LoginForm` (render + submission).
- [ ] Write unit test for at least **1 validation utility function**.

### Phase 7: DevOps & CI/CD 🚀

- [ ] Create `Dockerfile` for the Next.js app.
- [ ] Create `docker-compose.yml` (App + MongoDB container for local dev).
- [ ] Ensure the app runs successfully inside the Docker container.
- [ ] Create **GitHub Actions Workflow** (`.github/workflows/ci.yml`).
- Trigger: `push` or `pull_request` on `main`.
- Steps:
- [ ] Install dependencies.
- [ ] Run unit tests (`npm test`).
- [ ] Check build (`npm run build`).
- [ ] Build Docker image.

- _Constraint:_ Pipeline MUST fail if any step fails.
