# Quick Setup Guide

## Prerequisites

- Node.js 18+ installed
- Docker and Docker Compose installed
- PostgreSQL (if running without Docker)

## Option 1: Docker Setup (Recommended)

This is the fastest way to get started. All services will run in containers.

```bash
# Navigate to project directory
cd store-ratings-app

# Start all services (database, backend, frontend)
docker-compose up -d

# Wait for services to start (about 30 seconds)
# Backend will be available at http://localhost:5000
# Frontend will be available at http://localhost:3000

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## Option 2: Manual Setup

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/store_ratings

# Run migrations
npm run migrate

# Seed database with sample data
npm run seed

# Start development server
npm run dev
```

Backend will run on http://localhost:5000

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will run on http://localhost:3000

## Default Login Credentials

After seeding, use these accounts:

**Admin Account:**
- Email: admin@example.com
- Password: Admin@123!

**Normal User Account:**
- Email: user@example.com
- Password: User@123!

**Store Owner Account:**
- Email: owner@example.com
- Password: Owner@123!

## Testing the Application

### 1. Test User Flow
1. Go to http://localhost:3000
2. Click "Sign up" and create a new account
3. Login with your new account
4. Browse stores and submit ratings
5. Modify your ratings

### 2. Test Admin Flow
1. Login with admin credentials
2. View dashboard metrics
3. Create a new store
4. Manage users and stores

### 3. Test Owner Flow
1. Login with owner credentials
2. View your stores
3. See ratings and raters for your stores

## API Testing with Postman

1. Import `postman_collection.json` into Postman
2. Set the `baseUrl` variable to `http://localhost:5000/api`
3. Login to get a token
4. Set the `token` variable with the received JWT
5. Test all endpoints

## Running Tests

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Troubleshooting

### Port Already in Use
If ports 3000, 5000, or 5432 are already in use:
- Stop the conflicting service
- Or modify the ports in docker-compose.yml

### Database Connection Error
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify database credentials

### Migration Errors
```bash
# Reset database (WARNING: deletes all data)
cd backend
npm run migrate
npm run seed
```

### Docker Issues
```bash
# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# View container logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

## Project Structure

```
store-ratings-app/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── routes/         # API routes
│   │   ├── migrations/     # Database migrations & seeds
│   │   └── utils/          # Validators and helpers
│   └── tests/              # Backend tests
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   └── hooks/          # Custom React hooks
│   └── public/             # Static assets
├── docker-compose.yml      # Docker orchestration
├── postman_collection.json # API testing collection
└── CHECKLIST.md           # Verification checklist
```

## Next Steps

1. Review the CHECKLIST.md to verify all features
2. Customize the styling in frontend/src/index.css
3. Add more test cases in backend/tests/
4. Configure production environment variables
5. Set up CI/CD pipeline (GitHub Actions included)

## Support

For issues or questions:
1. Check the CHECKLIST.md for common issues
2. Review the README.md for detailed documentation
3. Check application logs for error messages
