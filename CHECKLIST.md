# Store Ratings Application - Verification Checklist

## Authentication & Authorization
- [ ] Signup works for user, owner, and admin roles
- [ ] Login works and returns JWT token
- [ ] Password validation enforces 8-16 chars, 1 uppercase, 1 special character
- [ ] Name validation enforces 20-60 characters
- [ ] Address validation enforces max 400 characters
- [ ] Email validation works correctly
- [ ] JWT token is stored and used for authenticated requests
- [ ] Unauthorized access is blocked (401/403 responses)

## User Roles & Dashboards
- [ ] Admin can access admin dashboard
- [ ] Admin can view total users, stores, and ratings metrics
- [ ] Admin can create, update, and delete stores
- [ ] Admin can view and delete users
- [ ] Normal users can access store listing page
- [ ] Normal users can submit ratings (1-5)
- [ ] Normal users can modify their own ratings
- [ ] Store owners can view their stores
- [ ] Store owners can see list of raters for their stores
- [ ] Store owners can see average rating for their stores

## Store Management
- [ ] Stores can be listed with pagination
- [ ] Search by store name works
- [ ] Filter by address works
- [ ] Sorting by name, rating, and date works
- [ ] Store cards display name, address, average rating, and rating count
- [ ] Store details show user's submitted rating if exists
- [ ] CRUD operations work for admin role

## Rating System
- [ ] Users can submit ratings (1-5 stars)
- [ ] Users can modify their existing ratings
- [ ] Unique constraint prevents duplicate ratings (one per user per store)
- [ ] Average rating is calculated correctly
- [ ] Rating count is displayed accurately
- [ ] Comments are optional and saved correctly

## UI/UX
- [ ] Responsive design works on mobile, tablet, and desktop
- [ ] Tailwind CSS styling is applied consistently
- [ ] Rating stars are interactive and show hover effects
- [ ] Forms show validation errors inline
- [ ] Toast notifications appear for success/error messages
- [ ] Modals open and close properly
- [ ] Tables support sorting and filtering
- [ ] Loading states are displayed during API calls
- [ ] Navigation bar shows user info and logout button

## Database
- [ ] Migrations run successfully
- [ ] Seed data is created (admin, user, owner, stores, ratings)
- [ ] Foreign key constraints work correctly
- [ ] Unique constraints are enforced
- [ ] Indexes are created for performance
- [ ] Check constraints validate rating range (1-5)

## API Endpoints
- [ ] POST /api/auth/signup - Creates new user
- [ ] POST /api/auth/login - Authenticates user
- [ ] GET /api/stores - Lists stores with filters
- [ ] GET /api/stores/:id - Gets store details
- [ ] POST /api/stores - Creates store (admin only)
- [ ] PUT /api/stores/:id - Updates store (admin only)
- [ ] DELETE /api/stores/:id - Deletes store (admin only)
- [ ] GET /api/stores/:id/raters - Lists raters (owner/admin)
- [ ] POST /api/ratings - Submits rating
- [ ] PUT /api/ratings/:id - Updates rating
- [ ] GET /api/admin/metrics - Gets dashboard metrics
- [ ] GET /api/admin/users - Lists users (admin only)
- [ ] DELETE /api/admin/users/:id - Deletes user (admin only)

## Security
- [ ] Passwords are hashed with bcrypt
- [ ] JWT tokens expire after configured time
- [ ] Rate limiting is applied to auth endpoints
- [ ] CORS is configured
- [ ] Helmet security headers are applied
- [ ] SQL injection is prevented (parameterized queries)
- [ ] XSS protection is in place
- [ ] Role-based access control works correctly

## Testing
- [ ] Backend unit tests pass
- [ ] API integration tests pass
- [ ] Frontend component tests pass
- [ ] CI pipeline runs successfully

## Docker & Deployment
- [ ] docker-compose.yml is configured correctly
- [ ] Backend Dockerfile builds successfully
- [ ] Frontend Dockerfile builds successfully
- [ ] PostgreSQL container starts and connects
- [ ] All services start with docker-compose up
- [ ] Environment variables are configured
- [ ] Migrations run automatically on container start
- [ ] Seed data is created on first run

## Documentation
- [ ] README.md has clear setup instructions
- [ ] API endpoints are documented
- [ ] Environment variables are listed
- [ ] Default user credentials are provided
- [ ] Postman collection is included
- [ ] Database schema is documented

## Default Test Accounts
After seeding, verify these accounts work:
- [ ] Admin: admin@example.com / Admin@123!
- [ ] User: user@example.com / User@123!
- [ ] Owner: owner@example.com / Owner@123!

## Critical User Flows
- [ ] User signup → login → view stores → submit rating → modify rating
- [ ] Admin login → view dashboard → create store → delete user
- [ ] Owner login → view owned stores → see raters list
- [ ] Search stores → filter by address → sort by rating
- [ ] Submit rating → see updated average → edit rating → see new average

## Performance
- [ ] API responses are fast (<500ms for most requests)
- [ ] Database queries use indexes
- [ ] Pagination limits large result sets
- [ ] Frontend renders smoothly without lag

## Accessibility
- [ ] Forms have proper labels
- [ ] Error messages are clear and helpful
- [ ] Keyboard navigation works
- [ ] Color contrast is sufficient
- [ ] Interactive elements have hover states

---

## Quick Test Commands

### Start Application
```bash
docker-compose up -d
```

### Run Backend Tests
```bash
cd backend
npm test
```

### Run Frontend Tests
```bash
cd frontend
npm test
```

### Check Logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Stop Application
```bash
docker-compose down
```
