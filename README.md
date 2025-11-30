# Piyush Portfolio Backend

A production-ready Node.js/Express backend API for managing portfolio projects and blog content with MongoDB.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Project Management**: CRUD operations for portfolio projects with image uploads
- **Blog System**: Full-featured blog with categories, tags, and search functionality
- **File Upload**: Secure file upload with Multer and Cloudinary integration
- **Admin Dashboard**: Protected admin routes for content management
- **Security**: Rate limiting, CORS, input validation, and data sanitization
- **Database**: MongoDB with Mongoose ODM and comprehensive schemas
- **Production Ready**: Environment-based configuration and error handling

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/piyush-portfolio
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=30d
   FRONTEND_URL=http://localhost:3000
   ADMIN_EMAIL=admin@piyushkatole.com
   ADMIN_PASSWORD=admin123456
   ```

4. **Start MongoDB** (if using local installation)
   ```bash
   mongod
   ```

5. **Seed the database** (optional)
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/        # Route controllers
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   └── blogController.js
│   ├── middleware/         # Custom middleware
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/            # Mongoose models
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Blog.js
│   ├── routes/            # Express routes
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── blogs.js
│   │   └── admin.js
│   └── scripts/           # Utility scripts
│       └── seedData.js
├── uploads/               # File uploads directory
├── .env                   # Environment variables
├── .gitignore
├── package.json
└── server.js             # Entry point
```

## 🔗 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /me` - Get current user
- `PUT /profile` - Update user profile
- `PUT /change-password` - Change password
- `POST /logout` - User logout

### Project Routes (`/api/projects`)
- `GET /` - Get all projects (public)
- `GET /:slug` - Get single project by slug
- `POST /` - Create project (admin only)
- `PUT /:id` - Update project (admin only)
- `DELETE /:id` - Delete project (admin only)
- `GET /admin/stats` - Get project statistics (admin only)

### Blog Routes (`/api/blogs`)
- `GET /` - Get all blogs (public)
- `GET /categories` - Get blog categories
- `GET /tags` - Get popular tags
- `GET /:slug` - Get single blog by slug
- `POST /:id/like` - Like a blog post
- `POST /` - Create blog (admin only)
- `PUT /:id` - Update blog (admin only)
- `DELETE /:id` - Delete blog (admin only)
- `GET /admin/stats` - Get blog statistics (admin only)

### Admin Routes (`/api/admin`)
- `GET /dashboard` - Dashboard statistics
- `GET /projects` - All projects (admin view)
- `GET /blogs` - All blogs (admin view)
- `GET /users` - All users
- `PUT /users/:id/status` - Update user status

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles
- **user**: Basic user role
- **admin**: Full access to all resources

## 📤 File Upload

The API supports file uploads for:
- Project images (multiple files)
- Blog featured images (single file)

**Supported formats**: JPG, JPEG, PNG, GIF, WEBP, PDF, DOC, DOCX
**Max file size**: 5MB per file
**Max files**: 10 files per request for projects

## 🗄️ Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  avatar: String,
  bio: String,
  isActive: Boolean,
  lastLogin: Date
}
```

### Project Model
```javascript
{
  title: String,
  slug: String (auto-generated),
  description: String,
  longDescription: String,
  category: String,
  status: String,
  technologies: [String],
  tags: [String],
  images: [Object],
  demoUrl: String,
  githubUrl: String,
  year: Number,
  features: [String],
  challenges: [Object],
  isPublished: Boolean,
  isFeatured: Boolean
}
```

### Blog Model
```javascript
{
  title: String,
  slug: String (auto-generated),
  excerpt: String,
  content: String,
  featuredImage: Object,
  category: String,
  tags: [String],
  status: String,
  publishedAt: Date,
  readTime: Number (auto-calculated),
  views: Number,
  likes: Number,
  tableOfContents: [Object] (auto-generated)
}
```

## 🔍 Query Parameters

### Projects
- `category` - Filter by category
- `status` - Filter by status
- `featured` - Filter featured projects
- `search` - Search in title, description, technologies
- `tags` - Filter by tags
- `technologies` - Filter by technologies
- `year` - Filter by year
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sort` - Sort order (default: -createdAt)

### Blogs
- `category` - Filter by category
- `status` - Filter by status (admin only)
- `featured` - Filter featured blogs
- `search` - Full-text search
- `tags` - Filter by tags
- `author` - Filter by author
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sort` - Sort order (newest/oldest/popular/title)

## 🛡️ Security Features

- **Rate Limiting**: 100 requests per 15 minutes in production
- **CORS**: Configured for specific origins
- **Helmet**: Security headers
- **Input Validation**: Express-validator for request validation
- **Data Sanitization**: Protection against NoSQL injection
- **File Upload Security**: File type and size restrictions
- **JWT**: Secure token-based authentication
- **Password Hashing**: bcryptjs with salt rounds

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your-super-secret-production-jwt-key
FRONTEND_URL=https://yourdomain.com
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Docker Support
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📊 Monitoring and Logging

- Request logging middleware
- Error tracking and reporting
- Health check endpoint (`/api/health`)
- Database connection monitoring

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 API Documentation

For detailed API documentation, visit `/api/docs` when the server is running (if Swagger is configured).

## 🐛 Common Issues

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string format
- Verify network connectivity for Atlas

### File Upload Issues
- Check file size limits
- Verify file types are allowed
- Ensure uploads directory exists

### Authentication Issues
- Verify JWT secret is set
- Check token expiration
- Ensure proper Authorization header format

## 📞 Support

For support and questions:
- Email: piyush@example.com
- GitHub Issues: [Create an issue](repository-url/issues)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by Piyush Katole**