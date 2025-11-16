# Store Ratings Application - Project Summary

## Overview

A full-stack web application for managing and rating stores with role-based access control. Built with React, Express.js, and PostgreSQL.

## Tech Stack

### Frontend
- **React 18** - UI library with hooks and functional components
- **React Router 6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client with interceptors

### Backend
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **express-validator** - Input validation

### DevOps
- **Docker & Docker Compose** - Containerization
- **GitHub Actions** - CI/CD pipeline
- **Jest** - Testing framework

## Key Features

### 1. Authentication System
- Signup with role selection (admin, user, owner)
- Login with JWT token generation
- Password requirements: 8-16 chars, 1 uppercase, 1 special character
- Name validation: 20-60 characters
- Address validation: max 400 characters

### 2. Role-Based Access Control

**Admin:**
- View dashboard with metrics (total users, stores, ratings)
- Create, update, delete stores
- View and delete users
- Full system access

**Normal User:**
- Browse stores with search and filters
- Submit ratings (1-5 stars) with optional comments
- Modify their own ratings
- View average ratings and rating counts

**Store Owner:**
- View owned stores
- See list of raters for their stores
- View average ratings and individual ratings
- Access rater details (name, email, rating, comment)

### 3. Store Management
- Searchable store listing
- Filter by name and address
- Sort by name, rating, or date
- Pagination support
- Store cards with visual rating display
- Average rating calculation

### 4. Rating System
- 1-5 star rating with interactive UI
- Optional comment field
- Unique constraint (one rating per user per store)
- Inline rating modification
- Real-time average calculation

### 5. Modern UI/UX
- Responsive design (mobile, tablet, desktop)
- Clean dashboard layout
- Interactive rating stars with hover effects
- Toast notifications for feedback
- Modal dialogs for forms
- Inline validation with error messages
- Loading states

## Database Schema

### users
- id (PK)
- name (20-60 chars)
- email (unique)
- password_hash
- address (max 400 chars)
- role (admin/user/owner)
- created_at, updated_at

### stores
- id (PK)
- name
- email
- address (max 400 chars)
- owner_id (FK → users)
- created_at, updated_at

### ratings
- id (PK)
- store_id (FK → stores)
- user_id (FK → users)
- rating (1-5)
- comment
- created_at, updated_at
- UNIQUE(store_id, user_id)

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Stores
- `GET /api/stores` - List stores (public, with filters)
- `GET /api/stores/:id` - Get store details
- `POST /api/stores` - Create store (admin)
- `PUT /api/stores/:id` - Update store (admin)
- `DELETE /api/stores/:id` - Delete store (admin)
- `GET /api/stores/:id/raters` - List raters (owner/admin)

### Ratings
- `POST /api/ratings` - Submit rating (user/owner)
- `PUT /api/ratings/:id` - Update rating (user/owner)
- `DELETE /api/ratings/:id` - Delete rating (user/owner)

### Admin
- `GET /api/admin/metrics` - Dashboard metrics (admin)
- `GET /api/admin/users` - List users (admin)
- `DELETE /api/admin/users/:id` - Delete user (admin)

## Security Features

1. **Password Security**
   - bcrypt hashing with salt rounds
   - Strong password requirements

2. **Authentication**
   - JWT tokens with expiration
   - Token validation on protected routes
   - Automatic token refresh handling

3. **Authorization**
   - Role-based middleware
   - Route protection by role
   - Owner verification for store access

4. **Input Validation**
   - Server-side validation with express-validator
   - Client-side validation for UX
   - SQL injection prevention (parameterized queries)

5. **Security Headers**
   - Helmet.js for HTTP headers
   - CORS configuration
   - Rate limiting on auth endpoints

## File Structure

```
store-ratings-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── storeController.js
│   │   │   ├── ratingController.js
│   │   │   └── adminController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── stores.js
│   │   │   ├── ratings.js
│   │   │   └── admin.js
│   │   ├── migrations/
│   │   │   ├── run.js
│   │   │   └── seed.js
│   │   ├── utils/
│   │   │   └── validators.js
│   │   └── server.js
│   ├── tests/
│   │   └── auth.test.js
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── NavBar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── StoreCard.jsx
│   │   │   ├── RatingStars.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── FormInput.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── UserStores.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── OwnerDashboard.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   ├── stores.js
│   │   │   ├── ratings.js
│   │   │   └── admin.js
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── Dockerfile
│   ├── tailwind.config.js
│   └── postcss.config.js
├── .github/
│   └── workflows/
│       └── ci.yml
├── docker-compose.yml
├── postman_collection.json
├── README.md
├── SETUP.md
├── CHECKLIST.md
└── .gitignore
```

## Development Workflow

1. **Local Development**
   ```bash
   docker-compose up -d
   ```

2. **Run Tests**
   ```bash
   cd backend && npm test
   cd frontend && npm test
   ```

3. **View Logs**
   ```bash
   docker-compose logs -f
   ```

4. **Stop Services**
   ```bash
   docker-compose down
   ```

## Testing Strategy

### Backend Tests
- Authentication endpoints (signup, login)
- Authorization middleware
- Rating CRUD operations
- Admin endpoints
- Input validation

### Frontend Tests
- Component rendering
- User interactions
- Form validation
- API integration

### E2E Tests (Recommended)
- User signup → login → rate store flow
- Admin store management flow
- Owner dashboard flow

## Deployment Considerations

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_EXPIRES_IN` - Token expiration time
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port

### Production Checklist
- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Set up database backups
- [ ] Configure logging service
- [ ] Set up monitoring (e.g., PM2, New Relic)
- [ ] Use environment-specific configs
- [ ] Enable rate limiting
- [ ] Set up CDN for static assets

## Performance Optimizations

1. **Database**
   - Indexes on frequently queried columns
   - Pagination for large datasets
   - Connection pooling

2. **API**
   - Response caching where appropriate
   - Efficient SQL queries with JOINs
   - Rate limiting to prevent abuse

3. **Frontend**
   - Code splitting
   - Lazy loading routes
   - Debounced search inputs
   - Optimized images

## Future Enhancements

1. **Features**
   - Email verification
   - Password reset functionality
   - Store categories/tags
   - Advanced search filters
   - Rating analytics dashboard
   - Export data to CSV
   - Image uploads for stores
   - Review moderation system

2. **Technical**
   - Redis caching
   - WebSocket for real-time updates
   - GraphQL API option
   - Mobile app (React Native)
   - Advanced analytics
   - Elasticsearch for search

3. **UI/UX**
   - Dark mode
   - Multiple language support
   - Accessibility improvements
   - Advanced animations
   - Progressive Web App (PWA)

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Review and rotate JWT secrets
- Monitor database performance
- Check error logs
- Backup database regularly
- Review and update security policies

### Monitoring
- API response times
- Error rates
- Database query performance
- User activity metrics
- System resource usage

## License

MIT License - Feel free to use this project for learning or commercial purposes.

## Credits

Built following modern web development best practices with:
- RESTful API design
- JWT authentication
- Role-based access control
- Responsive design principles
- Test-driven development
- Docker containerization
- CI/CD automation
