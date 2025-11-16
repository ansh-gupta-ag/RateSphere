# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              React Frontend (Port 3000)                 │ │
│  │  - React Router for navigation                          │ │
│  │  - Tailwind CSS for styling                             │ │
│  │  - Axios for API calls                                  │ │
│  │  - JWT stored in localStorage                           │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS
                              │ REST API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       API LAYER                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │            Express.js Backend (Port 5000)               │ │
│  │                                                          │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │ │
│  │  │   Routes     │  │  Middleware  │  │ Controllers  │ │ │
│  │  │              │  │              │  │              │ │ │
│  │  │ - Auth       │  │ - JWT Auth   │  │ - Auth       │ │ │
│  │  │ - Stores     │  │ - RBAC       │  │ - Stores     │ │ │
│  │  │ - Ratings    │  │ - Validation │  │ - Ratings    │ │ │
│  │  │ - Admin      │  │ - Error      │  │ - Admin      │ │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ SQL Queries
                              │ pg (node-postgres)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │          PostgreSQL Database (Port 5432)                │ │
│  │                                                          │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐             │ │
│  │  │  users   │  │  stores  │  │ ratings  │             │ │
│  │  │          │  │          │  │          │             │ │
│  │  │ - id     │  │ - id     │  │ - id     │             │ │
│  │  │ - name   │  │ - name   │  │ - rating │             │ │
│  │  │ - email  │  │ - address│  │ - comment│             │ │
│  │  │ - role   │  │ - owner  │  │ - user   │             │ │
│  │  └──────────┘  └──────────┘  └──────────┘             │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Request Flow

### User Authentication Flow
```
1. User enters credentials
   ↓
2. Frontend sends POST /api/auth/login
   ↓
3. Backend validates credentials
   ↓
4. bcrypt compares password hash
   ↓
5. JWT token generated
   ↓
6. Token sent to frontend
   ↓
7. Frontend stores token in localStorage
   ↓
8. Token included in subsequent requests (Authorization header)
```

### Rating Submission Flow
```
1. User selects store and rating
   ↓
2. Frontend sends POST /api/ratings
   ↓
3. JWT middleware validates token
   ↓
4. Authorization middleware checks role
   ↓
5. Validation middleware checks input
   ↓
6. Controller processes request
   ↓
7. Database inserts rating (with UNIQUE constraint)
   ↓
8. Response sent to frontend
   ↓
9. Frontend updates UI and shows toast
```

## Component Architecture

### Frontend Component Tree
```
App
├── Router
    ├── LoginPage
    ├── SignupPage
    ├── ProtectedRoute
        ├── UserStores
        │   ├── NavBar
        │   ├── StoreCard (multiple)
        │   │   └── RatingStars
        │   ├── Modal
        │   │   └── RatingStars
        │   └── Toast
        ├── AdminDashboard
        │   ├── NavBar
        │   ├── Modal
        │   │   └── FormInput (multiple)
        │   └── Toast
        └── OwnerDashboard
            ├── NavBar
            └── Toast
```

## Database Relationships

```
┌─────────────┐
│    users    │
│             │
│ id (PK)     │◄─────────┐
│ name        │          │
│ email       │          │ owner_id (FK)
│ role        │          │
└─────────────┘          │
       │                 │
       │                 │
       │ user_id (FK)    │
       │                 │
       ▼                 │
┌─────────────┐    ┌─────────────┐
│   ratings   │    │   stores    │
│             │    │             │
│ id (PK)     │    │ id (PK)     │
│ rating      │    │ name        │
│ comment     │    │ address     │
│ user_id ────┼───►│ owner_id    │
│ store_id────┼───►│             │
└─────────────┘    └─────────────┘
  UNIQUE(store_id, user_id)
```

## Security Layers

```
┌──────────────────────────────────────────┐
│         Frontend Security                 │
│  - Input validation                       │
│  - XSS prevention (React escaping)        │
│  - Token storage in localStorage          │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│         Network Security                  │
│  - HTTPS (production)                     │
│  - CORS configuration                     │
│  - Rate limiting                          │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│         Backend Security                  │
│  - JWT validation                         │
│  - Role-based authorization               │
│  - Input sanitization                     │
│  - Helmet security headers                │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│         Database Security                 │
│  - Parameterized queries                  │
│  - Password hashing (bcrypt)              │
│  - Foreign key constraints                │
│  - Check constraints                      │
└──────────────────────────────────────────┘
```

## Deployment Architecture (Docker)

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Host                           │
│                                                          │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────┐ │
│  │   Frontend     │  │    Backend     │  │ PostgreSQL│ │
│  │   Container    │  │   Container    │  │ Container │ │
│  │                │  │                │  │           │ │
│  │  Node:18       │  │  Node:18       │  │ Postgres  │ │
│  │  Port: 3000    │  │  Port: 5000    │  │ Port:5432 │ │
│  │                │  │                │  │           │ │
│  │  React App     │  │  Express API   │  │ Database  │ │
│  └────────────────┘  └────────────────┘  └───────────┘ │
│         │                    │                  │       │
│         └────────────────────┴──────────────────┘       │
│                    Docker Network                        │
└─────────────────────────────────────────────────────────┘
                         │
                         │ Port Mapping
                         ▼
              ┌──────────────────────┐
              │   Host Machine       │
              │  localhost:3000      │
              │  localhost:5000      │
              │  localhost:5432      │
              └──────────────────────┘
```

## API Middleware Stack

```
Request
   │
   ▼
┌─────────────────┐
│  Rate Limiter   │ ← Prevents abuse
└─────────────────┘
   │
   ▼
┌─────────────────┐
│  CORS           │ ← Cross-origin requests
└─────────────────┘
   │
   ▼
┌─────────────────┐
│  Helmet         │ ← Security headers
└─────────────────┘
   │
   ▼
┌─────────────────┐
│  Body Parser    │ ← Parse JSON
└─────────────────┘
   │
   ▼
┌─────────────────┐
│  JWT Auth       │ ← Validate token
└─────────────────┘
   │
   ▼
┌─────────────────┐
│  Authorization  │ ← Check role
└─────────────────┘
   │
   ▼
┌─────────────────┐
│  Validation     │ ← Validate input
└─────────────────┘
   │
   ▼
┌─────────────────┐
│  Controller     │ ← Business logic
└─────────────────┘
   │
   ▼
┌─────────────────┐
│  Error Handler  │ ← Catch errors
└─────────────────┘
   │
   ▼
Response
```

## State Management (Frontend)

```
┌──────────────────────────────────────┐
│         Application State             │
│                                       │
│  ┌────────────────────────────────┐  │
│  │  localStorage                   │  │
│  │  - token                        │  │
│  │  - user (id, name, email, role) │  │
│  └────────────────────────────────┘  │
│                                       │
│  ┌────────────────────────────────┐  │
│  │  Component State (useState)     │  │
│  │  - stores list                  │  │
│  │  - ratings                      │  │
│  │  - loading states               │  │
│  │  - form data                    │  │
│  │  - error messages               │  │
│  └────────────────────────────────┘  │
│                                       │
│  ┌────────────────────────────────┐  │
│  │  Custom Hooks                   │  │
│  │  - useAuth                      │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

## CI/CD Pipeline

```
┌─────────────┐
│  Git Push   │
└─────────────┘
      │
      ▼
┌─────────────────────────────────┐
│     GitHub Actions Trigger       │
└─────────────────────────────────┘
      │
      ├──────────────┬──────────────┐
      ▼              ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│ Checkout │  │  Setup   │  │  Setup   │
│   Code   │  │ Node.js  │  │PostgreSQL│
└──────────┘  └──────────┘  └──────────┘
      │              │              │
      └──────────────┴──────────────┘
                     │
      ┌──────────────┴──────────────┐
      ▼                             ▼
┌──────────────┐          ┌──────────────┐
│   Backend    │          │   Frontend   │
│   Pipeline   │          │   Pipeline   │
│              │          │              │
│ - Install    │          │ - Install    │
│ - Migrate    │          │ - Test       │
│ - Test       │          │ - Build      │
└──────────────┘          └──────────────┘
      │                             │
      └──────────────┬──────────────┘
                     ▼
            ┌─────────────────┐
            │  Success/Fail   │
            │  Notification   │
            └─────────────────┘
```

## Scalability Considerations

### Horizontal Scaling
```
Load Balancer
      │
      ├─────────┬─────────┬─────────┐
      ▼         ▼         ▼         ▼
   API-1     API-2     API-3     API-N
      │         │         │         │
      └─────────┴─────────┴─────────┘
                  │
                  ▼
         Database (Primary)
                  │
         ┌────────┴────────┐
         ▼                 ▼
    Read Replica 1   Read Replica 2
```

### Caching Strategy
```
Request
   │
   ▼
┌─────────┐
│  Redis  │ ← Cache frequently accessed data
└─────────┘
   │ Cache Miss
   ▼
┌─────────┐
│Database │
└─────────┘
```

## Monitoring & Logging

```
┌──────────────────────────────────────┐
│         Application Logs              │
│  - Request/Response logs              │
│  - Error logs                         │
│  - Authentication attempts            │
└──────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────┐
│         Metrics Collection            │
│  - API response times                 │
│  - Database query performance         │
│  - Error rates                        │
│  - User activity                      │
└──────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────┐
│         Monitoring Dashboard          │
│  - Real-time metrics                  │
│  - Alerts and notifications           │
│  - Performance graphs                 │
└──────────────────────────────────────┘
```
