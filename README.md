# Mall & Home Utility Services

A product-based full-stack web application for discovering and booking home utility services. This project is being built incrementally as part of an internship.

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, React Router
**Backend:** Node.js, Express.js
**Database:** PostgreSQL (via Prisma ORM)
**Auth:** bcrypt (password hashing), JWT (authentication)

## Project Structure

```
mall-home-utility-services/
├── frontend/   # React + Vite + Tailwind CSS
│   └── src/
│       ├── components/   # ProtectedRoute
│       ├── context/      # AuthContext
│       ├── lib/          # API helper
│       └── pages/        # Landing, Login, Register, Dashboards
└── backend/    # Node.js + Express API
    └── src/
        ├── controllers/  # Auth controllers
        ├── lib/          # Prisma client
        ├── middleware/   # authenticate, requireRole
        ├── routes/       # health, auth
        └── services/     # Auth service logic
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm
- PostgreSQL database (local or cloud, e.g. Supabase)

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in DATABASE_URL and JWT_SECRET
npx prisma generate     # generate Prisma client
npx prisma db push      # sync schema to database
npm run dev
```

The server starts on `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # edit if needed
npm run dev
```

The app opens at `http://localhost:5173`.

## API Endpoints

| Method | Route               | Description                          | Auth |
|--------|---------------------|--------------------------------------|------|
| GET    | `/api/health`       | Health check                         | No   |
| POST   | `/api/auth/register`| Register a new user                  | No   |
| POST   | `/api/auth/login`   | Login and receive JWT                 | No   |
| GET    | `/api/auth/me`      | Get current authenticated user       | Yes  |

## User Roles

- **CUSTOMER** — Can access the customer area
- **PROVIDER** — Can access the provider area
- **ADMIN** — Can access the admin area (not available for public registration)

## Environment Variables

### Backend (`backend/.env`)

| Variable       | Description                              |
|----------------|------------------------------------------|
| `PORT`         | Port the Express server listens on (5000)|
| `CLIENT_URL`   | Frontend origin for CORS                |
| `DATABASE_URL` | PostgreSQL connection string             |
| `JWT_SECRET`   | Secret key for signing JWT tokens         |

### Frontend (`frontend/.env`)

| Variable       | Description                          |
|----------------|--------------------------------------|
| `VITE_API_URL`  | Backend API URL (empty = use proxy) |

> The Vite dev server proxies `/api` requests to the backend, so the frontend can call `/api/*` directly during development.
