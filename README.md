# Mall & Home Utility Services

A product-based full-stack web application for discovering and booking home utility services. This project is being built incrementally as part of an internship.

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS
**Backend:** Node.js, Express.js
**Database:** PostgreSQL

## Project Structure

```
mall-home-utility-services/
├── frontend/   # React + Vite + Tailwind CSS
└── backend/    # Node.js + Express API
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Backend

```bash
cd backend
npm install
cp .env.example .env   # then edit values if needed
npm run dev
```

The server starts on `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # then edit values if needed
npm run dev
```

The app opens at `http://localhost:5173`.

## API Endpoints

| Method | Route          | Description                        |
|--------|----------------|------------------------------------|
| GET    | `/api/health`  | Health check — confirms backend is running |

## Environment Variables

### Backend (`backend/.env`)

| Variable    | Default                  | Description                       |
|-------------|--------------------------|-----------------------------------|
| `PORT`      | `5000`                   | Port the Express server listens on|
| `CLIENT_URL`| `http://localhost:5173`  | Frontend origin for CORS          |

### Frontend (`frontend/.env`)

| Variable       | Default                  | Description                          |
|----------------|--------------------------|--------------------------------------|
| `VITE_API_URL` | `http://localhost:5000`  | Backend API base URL                 |

> The Vite dev server also proxies `/api` requests to the backend, so the frontend can call `/api/health` directly without worrying about CORS during development.
