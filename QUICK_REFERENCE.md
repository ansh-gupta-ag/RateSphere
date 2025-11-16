# Quick Reference Guide

## 🚀 Quick Start

```bash
cd store-ratings-app
docker-compose up -d
```

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Database: localhost:5432

## 🔑 Default Credentials

| Role  | Email                | Password    |
|-------|---------------------|-------------|
| Admin | admin@example.com   | Admin@123!  |
| User  | user@example.com    | User@123!   |
| Owner | owner@example.com   | Owner@123!  |

## 📋 Validation Rules

| Field    | Rule                                              |
|----------|---------------------------------------------------|
| Name     | 20-60 characters                                  |
| Email    | Valid email format                                |
| Password | 8-16 chars, 1 uppercase, 1 special character     |
| Address  | Max 400 characters                                |
| Rating   | Integer 1-5                                       |

## 🛣️ API Endpoints Quick Reference

### Auth
```
POST   /api/auth/signup    - Register
POST   /api/auth/login     - Login
```

### Stores
```
GET    /api/stores              - List (public)
GET    /api/stores/:id          - Details
POST   /api/stores              - Create (admin)
PUT    /api/stores/:id          - Update (admin)
DELETE /api/stores/:id          - Delete (admin)
GET    /api/stores/:id/raters   - Raters (owner/admin)
```

### Ratings
```
POST   /api/ratings        - Submit (user/owner)
PUT    /api/ratings/:id    - Update (user/owner)
DELETE /api/ratings/:id    - Delete (user/owner)
```

### Admin
```
GET    /api/admin/metrics      - Dashboard metrics
GET    /api/admin/users        - List users
DELETE /api/admin/users/:id    - Delete user
```

## 🎨 Component Reference

### Frontend Components
- `NavBar` - Top navigation with user info
- `ProtectedRoute` - Route guard with role check
- `StoreCard` - Store display with rating
- `RatingStars` - Interactive star rating
- `Modal` - Reusable modal dialog
- `Toast` - Notification messages
- `FormInput` - Input with validation

### Pages
- `LoginPage` - User login
- `SignupPage` - User registration
- `UserStores` - Store browsing and rating
- `AdminDashboard` - Admin management
- `OwnerDashboard` - Owner store view

## 🔧 Common Commands

### Docker
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart service
docker-compose restart backend

# Stop all
docker-compose down

# Rebuild
docker-compose build --no-cache
```

### Backend
```bash
cd backend

# Install
npm install

# Run migrations
npm run migrate

# Seed data
npm run seed

# Dev server
npm run dev

# Tests
npm test
```

### Frontend
```bash
cd frontend

# Install
npm install

# Dev server
npm start

# Build
npm run build

# Tests
npm test
```

## 🐛 Troubleshooting

### Port in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Database reset
```bash
cd backend
npm run migrate
npm run seed
```

### Clear Docker
```bash
docker-compose down -v
docker-compose up -d
```

## 📊 Database Schema Quick View

```sql
users (id, name, email, password_hash, address, role)
stores (id, name, email, address, owner_id)
ratings (id, store_id, user_id, rating, comment)
  UNIQUE(store_id, user_id)
```

## 🎯 Feature Access Matrix

| Feature              | Admin | Owner | User |
|---------------------|-------|-------|------|
| View stores         | ✅    | ✅    | ✅   |
| Submit rating       | ❌    | ✅    | ✅   |
| Modify own rating   | ❌    | ✅    | ✅   |
| Create store        | ✅    | ❌    | ❌   |
| Delete store        | ✅    | ❌    | ❌   |
| View all users      | ✅    | ❌    | ❌   |
| Delete users        | ✅    | ❌    | ❌   |
| View store raters   | ✅    | ✅*   | ❌   |
| Dashboard metrics   | ✅    | ❌    | ❌   |

*Owner can only view raters for their own stores

## 🧪 Testing Quick Commands

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# Coverage
cd backend && npm test -- --coverage

# Watch mode
cd frontend && npm test -- --watch
```

## 📦 Environment Variables

### Backend (.env)
```env
PORT=5000
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🔐 Security Checklist

- [x] Passwords hashed with bcrypt
- [x] JWT authentication
- [x] Role-based authorization
- [x] Input validation (client + server)
- [x] SQL injection prevention
- [x] Rate limiting on auth
- [x] CORS configured
- [x] Security headers (Helmet)

## 📈 Performance Tips

1. Use pagination for large lists
2. Debounce search inputs (300ms)
3. Index database columns
4. Cache static assets
5. Optimize images
6. Use connection pooling

## 🎨 Tailwind Classes Reference

```jsx
// Buttons
className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"

// Cards
className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg"

// Inputs
className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"

// Badges
className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-700"
```

## 📱 Responsive Breakpoints

```
sm: 640px   - Small devices
md: 768px   - Medium devices
lg: 1024px  - Large devices
xl: 1280px  - Extra large
```

## 🔄 Git Workflow

```bash
# Feature branch
git checkout -b feat/new-feature

# Commit
git add .
git commit -m "feat: add new feature"

# Push
git push origin feat/new-feature

# Create PR on GitHub
```

## 📞 Support Resources

- README.md - Full documentation
- SETUP.md - Setup instructions
- CHECKLIST.md - Verification checklist
- PROJECT_SUMMARY.md - Project overview
- postman_collection.json - API testing
