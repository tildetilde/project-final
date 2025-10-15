# Backend API Server

A Node.js/Express/TypeScript backend server for the Banganza quiz application.

## Architecture

The backend follows a clean, layered architecture:

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Express middleware
├── models/          # Mongoose models
├── routes/          # API route definitions
├── services/        # Business logic services
├── types/           # TypeScript type definitions
```


## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file

3. Configure environment variables in `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/your_database
PORT=8888
NODE_ENV=development
FRONTEND_URI=http://127.0.0.1:5173
JWT_SECRET=your_secure_jwt_secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure_password
ADMIN_EMAIL=admin@example.com
```

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Database Seeding
```bash
npm run seed
```

### Create Admin User
```bash
npm run create-admin
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Type check without building
- `npm run seed` - Seed database with sample data
- `npm run create-admin` - Create initial admin user

## API Endpoints

### Public Endpoints
- `GET /` - Health check
- `GET /health` - Detailed health status
- `GET /api/quiz/categories` - Get all quiz categories
- `GET /api/quiz/category/:categoryId/items` - Get all items for a category
- `POST /api/quiz/check` - Check quiz answers

### Protected Endpoints (Admin)
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/profile` - Get admin profile
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/categories` - Get all categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category
- `GET /api/admin/items` - Get all items
- `POST /api/admin/items` - Create item
- `PUT /api/admin/items/:id` - Update item
- `DELETE /api/admin/items/:id` - Delete item

## Authentication

Admin endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "path": "/api/endpoint",
    "method": "GET"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": { ... }
  },
  "meta": { ... }
}
```

## Database Models

### Admin
- Username, password, email
- Active status and last login tracking

### Category
- ID, name, description, question
- Unit, sort order, source information

### Item
- ID, name, value, label
- Category reference and source 