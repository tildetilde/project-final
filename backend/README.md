# Backend API Server

A Node.js/Express/TypeScript backend server for the Banganza quiz application.

## 🏗️ Architecture

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
└── utils/           # Utility functions and classes
```

## 🚀 Features

- **RESTful API** with consistent response format
- **JWT Authentication** for admin endpoints
- **MongoDB** with Mongoose ODM
- **TypeScript** for type safety
- **Structured logging** with context
- **Error handling** with custom error classes
- **Input validation** middleware
- **Environment configuration** validation

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB instance
- TypeScript knowledge

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

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

## 🏃‍♂️ Running the Server

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

## 📚 API Endpoints

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

## 🔐 Authentication

Admin endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📝 Response Format

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

## 🗄️ Database Models

### Admin
- Username, password (hashed), email
- Active status and last login tracking

### Category
- ID, name, description, question
- Unit, sort order, source information

### Item
- ID, name, value, label
- Category reference and source

## 🛡️ Security Features

- **Password hashing** with bcrypt
- **JWT tokens** with expiration
- **CORS configuration** for frontend
- **Input validation** middleware
- **Error sanitization** in production

## 📊 Logging

Structured logging with different levels:
- **ERROR** - Application errors
- **WARN** - Warning conditions
- **INFO** - General information
- **DEBUG** - Debug information (development only)

## 🧪 Testing

Run the linter and type checker:
```bash
npm run lint
npm run type-check
```

## 🚀 Deployment

1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set secure JWT secret
4. Build the application: `npm run build`
5. Start the server: `npm start`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Environment and database config
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── types/           # TypeScript interfaces
│   └── utils/           # Utilities and helpers
├── data/                # Seed data files
├── dist/                # Compiled JavaScript
└── package.json         # Dependencies and scripts
```

## 🤝 Contributing

1. Follow TypeScript best practices
2. Use the established error handling patterns
3. Maintain consistent API response format
4. Add appropriate logging
5. Run linting before committing

## 📄 License

ISC License