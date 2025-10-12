# Jeff Honforloco Photography Backend API

A comprehensive Node.js/Express backend API for the Jeff Honforloco Photography platform.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with admin roles
- **Contact Management**: Handle inquiries and lead tracking
- **Blog System**: Create, manage, and publish blog posts
- **Portfolio Management**: Organize and display portfolio images
- **Email Service**: Automated email sending with Nodemailer
- **Analytics**: Track contacts, views, and user interactions
- **Admin Dashboard**: Comprehensive admin panel with statistics
- **Data Export**: Export contacts and analytics data
- **Security**: Rate limiting, CORS, input validation, and security headers

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Email service (Gmail, SMTP, etc.)

## 🛠️ Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```

4. **Configure your .env file:**
   ```env
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   
   # Database
   DATABASE_URL=./database/photography.db
   
   # JWT Secrets (CHANGE THESE!)
   JWT_SECRET=your-super-secret-jwt-key
   REFRESH_TOKEN_SECRET=your-refresh-token-secret
   
   # Admin Credentials (CHANGE THESE!)
   ADMIN_USERNAME=jeff.admin
   ADMIN_EMAIL=jeff@jeffhonforlocophotos.com
   ADMIN_PASSWORD=your-secure-password
   
   # Email Configuration
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

5. **Start the server:**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api/v1
```

### Authentication Endpoints

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "jeff.admin",
  "password": "your-password"
}
```

#### Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer <token>
```

#### Refresh Token
```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

### Contact Endpoints

#### Create Contact (Public)
```http
POST /api/v1/contacts
Content-Type: application/json

{
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "message": "Interested in wedding photography",
  "service_type": "wedding",
  "budget_range": "$2000-$5000",
  "event_date": "2024-06-15",
  "location": "New York"
}
```

#### Get All Contacts (Admin)
```http
GET /api/v1/contacts?page=1&limit=20&status=new&search=john
Authorization: Bearer <token>
```

#### Update Contact Status (Admin)
```http
PUT /api/v1/contacts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "contacted",
  "notes": "Called client, scheduled consultation"
}
```

### Email Endpoints

#### Send Contact Email
```http
POST /api/v1/email/contact
Content-Type: application/json

{
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "message": "Interested in photography services",
  "service_type": "wedding",
  "budget_range": "$2000-$5000",
  "event_date": "2024-06-15",
  "location": "New York"
}
```

#### Send Newsletter Signup
```http
POST /api/v1/email/newsletter
Content-Type: application/json

{
  "email": "subscriber@example.com"
}
```

### Blog Endpoints

#### Get Published Posts (Public)
```http
GET /api/v1/blog?page=1&limit=10&search=photography
```

#### Get Single Post (Public)
```http
GET /api/v1/blog/slug/your-blog-post-slug
```

#### Create Post (Admin)
```http
POST /api/v1/blog
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Wedding Photography Tips",
  "content": "Full blog post content...",
  "slug": "wedding-photography-tips",
  "excerpt": "Short description...",
  "featured_image_url": "https://example.com/image.jpg",
  "status": "published",
  "tags": "wedding,photography,tips"
}
```

### Portfolio Endpoints

#### Get Portfolio Images (Public)
```http
GET /api/v1/portfolio?category=wedding&featured=true&page=1&limit=20
```

#### Get Featured Images (Public)
```http
GET /api/v1/portfolio/featured
```

#### Create Portfolio Image (Admin)
```http
POST /api/v1/portfolio
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Beautiful Wedding Shot",
  "description": "Couple at sunset",
  "image_url": "https://example.com/image.jpg",
  "thumbnail_url": "https://example.com/thumb.jpg",
  "category": "wedding",
  "is_featured": true,
  "sort_order": 1,
  "tags": "wedding,sunset,romantic"
}
```

### Admin Endpoints

#### Dashboard Statistics
```http
GET /api/v1/admin/dashboard
Authorization: Bearer <token>
```

#### Analytics Data
```http
GET /api/v1/admin/analytics
Authorization: Bearer <token>
```

#### Export Contacts
```http
GET /api/v1/admin/export/contacts
Authorization: Bearer <token>
```

## 🔧 Configuration

### Email Service Setup

#### Gmail Setup
1. Enable 2-factor authentication
2. Generate an App Password
3. Use your Gmail and App Password in .env

#### SMTP Setup
```env
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@domain.com
SMTP_PASS=your-password
```

### Database

The API uses SQLite by default, which is perfect for small to medium applications. The database file is created automatically at `./database/photography.db`.

#### Database Schema
- **users**: Admin users and authentication
- **contacts**: Contact form submissions
- **blog_posts**: Blog posts and articles
- **portfolio_images**: Portfolio images and metadata
- **email_sequences**: Email automation sequences
- **email_templates**: Email templates
- **analytics**: Analytics and tracking data

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3001
JWT_SECRET=your-production-jwt-secret
REFRESH_TOKEN_SECRET=your-production-refresh-secret
ADMIN_PASSWORD=your-secure-production-password
EMAIL_USER=your-production-email
EMAIL_PASS=your-production-email-password
```

### Deployment Options

#### 1. Traditional VPS/Server
```bash
# Install PM2 for process management
npm install -g pm2

# Start the application
pm2 start src/server.js --name "photography-api"

# Save PM2 configuration
pm2 save
pm2 startup
```

#### 2. Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

#### 3. Cloud Platforms
- **Heroku**: Add Procfile and deploy
- **Railway**: Connect GitHub repository
- **DigitalOcean App Platform**: Deploy from GitHub
- **AWS EC2**: Deploy on EC2 instance

## 🔒 Security Features

- **Rate Limiting**: Prevents abuse and DDoS attacks
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers for protection
- **Input Validation**: Comprehensive request validation
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **SQL Injection Protection**: Parameterized queries

## 📊 Monitoring & Logging

- **Health Check**: `GET /health`
- **API Documentation**: `GET /api/docs`
- **Logging**: Structured JSON logs
- **Error Tracking**: Comprehensive error handling

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 📈 Performance

- **Compression**: Gzip compression for responses
- **Database Indexing**: Optimized database queries
- **Caching**: Response caching for static data
- **Rate Limiting**: Prevents resource exhaustion

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: jeff@jeffhonforlocophotos.com
- Documentation: [API Docs](http://localhost:3001/api/docs)

## 🔄 Updates

### Version 1.0.0
- Initial release
- Complete API implementation
- Authentication system
- Contact management
- Blog system
- Portfolio management
- Email service
- Admin dashboard
