# User Service

Authentication service for the ODO Todo application. Handles user registration, login, and JWT token management.

## Features

- User registration with email validation and password hashing
- User login with JWT token generation
- Password security with bcrypt (12 salt rounds)
- Rate limiting and security middleware
- Comprehensive input validation
- Unit tests with Jest
- Docker containerization
- Health check endpoint

## API Documentation

Interactive API documentation is available via Swagger UI at:
- **Local Development**: http://localhost:3001/api-docs
- **Production**: {your-domain}/api-docs

The API documentation includes:
- Complete endpoint specifications
- Request/response schemas  
- Interactive testing interface
- Authentication examples

## API Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "user_email": "user@example.com",
  "user_pwd": "password123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "uuid": "user-uuid",
    "user_email": "user@example.com",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
}
```

### POST /api/auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "user_email": "user@example.com",
  "user_pwd": "password123"
}
```

**Response (200):**
```json
{
  "token": "jwt-token-here",
  "user": {
    "uuid": "user-uuid",
    "user_email": "user@example.com"
  }
}
```

### GET /health
Health check endpoint.

**Response (200):**
```json
{
  "status": "OK",
  "service": "User Service",
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `PORT` - Service port (default: 3001)
- `JWT_SECRET` - Secret key for JWT signing
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port
- `DB_NAME` - Database name
- `DB_USER` - Database username  
- `DB_PASSWORD` - Database password
- `NODE_ENV` - Environment (development/production)

## Database Schema

### users table
- `id` - Serial primary key
- `uuid` - Unique identifier (UUID v4)
- `user_email` - User email (unique)
- `user_pwd` - Hashed password
- `created_at` - Creation timestamp
- `updated_at` - Update timestamp

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production
npm run build

# Start production server
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Docker

```bash
# Build image
docker build -t user-service .

# Run container
docker run -p 3001:3001 user-service
```