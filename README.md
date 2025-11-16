# Store Ratings Application

A full-stack web application for store ratings with role-based access control.

## Features

- **Three User Roles**: System Administrator, Normal User, Store Owner
- **Authentication**: JWT-based signup/login
- **Store Management**: CRUD operations, search, filter, sort
- **Rating System**: Submit and modify ratings (1-5 stars)
- **Admin Dashboard**: User and store management with metrics
- **Responsive UI**: Modern design with Tailwind CSS

## Tech Stack

- **Frontend**: React, Tailwind CSS, Axios
- **Backend**: Express.js, JWT
- **Database**: PostgreSQL
- **Testing**: Jest, Cypress
- **DevOps**: Docker, Docker Compose, GitHub Actions

## Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### Local Development with Docker

```bash
# Clone and navigate
cd store-ratings-app

# Start all services
docker-compose up -d

# Backend runs on http://localhost:5000
# Frontend runs on http://localhost:3000
```

### Manual Setup

#### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run migrate
npm run seed
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
npm start
```

## Environment Variables

### Backend (.env)

```
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/store_ratings
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

## Database Schema

- **users**: id, name, email, password_hash, address, role, created_at, updated_at
- **stores**: id, name, email, address, owner_id, created_at, updated_at
- **ratings**: id, store_id, user_id, rating, comment, created_at, updated_at

## API Endpoints

### Auth
- POST `/api/auth/signup` - Register new user
- POST `/api/auth/login` - Login user

### Stores
- GET `/api/stores` - List stores (with search, filter, sort)
- GET `/api/stores/:id` - Get store details
- POST `/api/stores` - Create store (admin only)
- PUT `/api/stores/:id` - Update store (admin only)
- DELETE `/api/stores/:id` - Delete store (admin only)

### Ratings
- POST `/api/ratings` - Submit rating
- PUT `/api/ratings/:id` - Update rating
- GET `/api/stores/:id/raters` - List raters (owner only)

### Admin
- GET `/api/admin/metrics` - Dashboard metrics
- GET `/api/users` - List users (admin only)

## Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

## Default Users (after seeding)

- **Admin**: admin@example.com / Admin@123!
- **User**: user@example.com / User@123!
- **Owner**: owner@example.com / Owner@123!

## Validation Rules

- **Name**: 20-60 characters
- **Address**: Max 400 characters
- **Password**: 8-16 characters, at least one uppercase, one special character
- **Email**: Standard email format
- **Rating**: Integer 1-5

## Project Structure

```
store-ratings-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── migrations/
│   └── tests/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── utils/
│   └── public/
└── docker-compose.yml
```

## License

MIT
