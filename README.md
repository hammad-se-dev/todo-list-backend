# Todo App Backend

A complete RESTful API backend for a Todo application with user authentication and todo management.

## Features

### User Authentication

- ✅ User registration with email validation
- ✅ User login with JWT authentication
- ✅ Password change functionality
- ✅ Forgot password with email reset
- ✅ Password reset with secure tokens
- ✅ JWT token-based authentication

### Todo Management

- ✅ Create, read, update, delete todos
- ✅ Todo status management (pending/completed)
- ✅ Search todos by title and content
- ✅ Filter todos by status
- ✅ Pagination support
- ✅ Todo statistics and completion rates
- ✅ User-specific todo isolation

### User Profile

- ✅ Get user profile
- ✅ Update user profile (name, email, profile image)
- ✅ Delete user account
- ✅ Profile image URL support

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **nodemailer** - Email sending
- **cors** - Cross-origin resource sharing

## Installation

1. Clone the repository
2. Navigate to the backend directory:

   ```bash
   cd backend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file based on `env.example`:

   ```bash
   cp env.example .env
   ```

5. Configure your environment variables in `.env`:

   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/todo-app
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=30d
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   FRONTEND_URL=http://localhost:3000
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication Routes

#### Register User

```
POST /api/auth/register
Content-Type: application/json

{
  "fullname": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "profileImageUrl": "https://example.com/image.jpg" // optional
}
```

#### Login User

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User

```
GET /api/auth/me
Authorization: Bearer <token>
```

#### Forgot Password

```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Reset Password

```
PUT /api/auth/reset-password/:resettoken
Content-Type: application/json

{
  "password": "newpassword123"
}
```

#### Change Password

```
PUT /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

### Todo Routes

#### Get All Todos

```
GET /api/todos?page=1&limit=10&status=pending&search=work
Authorization: Bearer <token>
```

#### Get Single Todo

```
GET /api/todos/:id
Authorization: Bearer <token>
```

#### Create Todo

```
POST /api/todos
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project",
  "content": "Finish the todo app backend",
  "status": "pending" // optional, defaults to "pending"
}
```

#### Update Todo

```
PUT /api/todos/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "content": "Updated content",
  "status": "completed"
}
```

#### Delete Todo

```
DELETE /api/todos/:id
Authorization: Bearer <token>
```

#### Toggle Todo Status

```
PATCH /api/todos/:id/toggle
Authorization: Bearer <token>
```

#### Get Todo Statistics

```
GET /api/todos/stats/summary
Authorization: Bearer <token>
```

### User Routes

#### Get User Profile

```
GET /api/users/profile
Authorization: Bearer <token>
```

#### Update User Profile

```
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullname": "John Smith",
  "email": "johnsmith@example.com",
  "profileImageUrl": "https://example.com/new-image.jpg"
}
```

#### Delete User Account

```
DELETE /api/users/profile
Authorization: Bearer <token>
```

## Database Models

### User Model

```javascript
{
  fullname: String (required, 2-100 chars),
  email: String (required, unique, valid email),
  password: String (required, min 6 chars, hashed),
  profileImageUrl: String (optional),
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Todo Model

```javascript
{
  title: String (required, 1-200 chars),
  content: String (required, 1-1000 chars),
  userId: ObjectId (required, ref: User),
  status: String (enum: ['pending', 'completed'], default: 'pending'),
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // for validation errors
}
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- CORS configuration
- Rate limiting (can be added)
- Secure password reset tokens

## Development

### Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Environment Variables

Make sure to set up all required environment variables in your `.env` file before running the application.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
