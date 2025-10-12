# 🚀 Complete Backend Setup Guide

This guide will help you set up your own backend for the Jeff Honforloco Photography platform.

## 📋 What You're Getting

### ✅ **Complete Backend API**
- **Node.js/Express** server with TypeScript support
- **SQLite Database** with automatic schema creation
- **JWT Authentication** with admin roles
- **Email Service** with Nodemailer (Gmail/SMTP)
- **Contact Management** with lead tracking
- **Blog System** for content management
- **Portfolio Management** for image organization
- **Admin Dashboard** with analytics
- **Security Features** (rate limiting, CORS, validation)

### ✅ **Frontend Integration**
- Updated API service to connect to backend
- Removed Supabase dependencies
- Environment configuration ready

## 🛠️ Quick Setup (5 Minutes)

### 1. **Install Backend Dependencies**
```bash
cd backend
npm install
```

### 2. **Configure Environment**
```bash
# Copy environment template
cp env.example .env

# Edit the .env file with your settings
nano .env
```

**Required Environment Variables:**
```env
# Server
PORT=3001
NODE_ENV=development

# Database (auto-created)
DATABASE_URL=./database/photography.db

# JWT Secrets (CHANGE THESE!)
JWT_SECRET=your-super-secret-jwt-key-change-this
REFRESH_TOKEN_SECRET=your-refresh-token-secret-change-this

# Admin Login (CHANGE THESE!)
ADMIN_USERNAME=jeff.admin
ADMIN_EMAIL=jeff@jeffhonforlocophotos.com
ADMIN_PASSWORD=your-secure-admin-password

# Email Service (Gmail recommended)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 3. **Start Backend Server**
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

### 4. **Configure Frontend**
```bash
# In the main project directory
cp env.example .env.local

# Edit .env.local
nano .env.local
```

**Frontend Environment:**
```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:3001/api/v1

# Admin credentials (same as backend)
VITE_ADMIN_USERNAME=jeff.admin
VITE_ADMIN_PASSWORD_HASH=your-hashed-password
VITE_ADMIN_SALT=your-salt
```

### 5. **Test the Setup**
```bash
# Test backend health
curl http://localhost:3001/health

# Test API documentation
open http://localhost:3001/api/docs
```

## 📧 Email Service Setup

### **Option 1: Gmail (Recommended)**
1. Enable 2-factor authentication on your Gmail
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use your Gmail and App Password in `.env`

### **Option 2: SMTP Provider**
```env
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@domain.com
SMTP_PASS=your-password
```

## 🔐 Security Configuration

### **Change Default Credentials**
```env
# Change these in production!
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-very-secure-password
JWT_SECRET=your-very-long-random-jwt-secret
REFRESH_TOKEN_SECRET=your-very-long-random-refresh-secret
```

### **Production Environment**
```env
NODE_ENV=production
PORT=3001
# Use strong, unique secrets
JWT_SECRET=your-production-jwt-secret-64-chars-minimum
REFRESH_TOKEN_SECRET=your-production-refresh-secret-64-chars-minimum
```

## 🚀 Deployment Options

### **Option 1: Traditional Server**
```bash
# Install PM2 for process management
npm install -g pm2

# Start application
pm2 start src/server.js --name "photography-api"

# Auto-start on server reboot
pm2 startup
pm2 save
```

### **Option 2: Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### **Option 3: Cloud Platforms**
- **Railway**: Connect GitHub repo
- **Heroku**: Add Procfile
- **DigitalOcean**: App Platform
- **AWS**: EC2 or Lambda

## 📊 Admin Dashboard

### **Access Admin Panel**
1. Start the backend server
2. Open your frontend application
3. Navigate to `/admin`
4. Login with your admin credentials

### **Admin Features**
- **Dashboard**: Overview statistics
- **Contacts**: Manage inquiries and leads
- **Blog**: Create and manage blog posts
- **Portfolio**: Upload and organize images
- **Analytics**: View performance metrics
- **Settings**: Configure system settings

## 🔧 API Endpoints

### **Public Endpoints**
- `POST /api/v1/contacts` - Submit contact form
- `POST /api/v1/email/contact` - Send contact email
- `POST /api/v1/email/newsletter` - Newsletter signup
- `GET /api/v1/blog` - Get published blog posts
- `GET /api/v1/portfolio` - Get portfolio images

### **Admin Endpoints** (Require Authentication)
- `GET /api/v1/admin/dashboard` - Dashboard statistics
- `GET /api/v1/admin/analytics` - Analytics data
- `GET /api/v1/admin/export/contacts` - Export contacts
- `POST /api/v1/blog` - Create blog post
- `PUT /api/v1/portfolio/:id` - Update portfolio image

## 🧪 Testing Your Setup

### **1. Test Backend Health**
```bash
curl http://localhost:3001/health
```

### **2. Test Contact Form**
```bash
curl -X POST http://localhost:3001/api/v1/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User",
    "email": "test@example.com",
    "message": "Test message"
  }'
```

### **3. Test Email Service**
```bash
curl -X POST http://localhost:3001/api/v1/email/test
```

### **4. Test Frontend Integration**
1. Open your frontend application
2. Try submitting the contact form
3. Check your email for the notification
4. Login to admin panel

## 🐛 Troubleshooting

### **Common Issues**

#### **Backend Won't Start**
```bash
# Check if port is in use
lsof -i :3001

# Kill process if needed
kill -9 <PID>

# Check Node.js version
node --version  # Should be 18+
```

#### **Database Errors**
```bash
# Delete database and restart (will recreate)
rm -rf backend/database/
npm run dev
```

#### **Email Not Sending**
1. Check Gmail App Password setup
2. Verify SMTP settings
3. Check email service logs
4. Test with: `curl -X POST http://localhost:3001/api/v1/email/test`

#### **Frontend Can't Connect**
1. Verify backend is running on port 3001
2. Check `VITE_API_BASE_URL` in `.env.local`
3. Check CORS settings in backend
4. Check browser console for errors

### **Logs and Debugging**
```bash
# View backend logs
npm run dev  # Shows logs in console

# Check database
sqlite3 backend/database/photography.db
.tables
SELECT * FROM contacts LIMIT 5;
```

## 📈 Performance Optimization

### **Production Settings**
```env
NODE_ENV=production
# Enable compression
# Optimize database queries
# Use PM2 for process management
# Set up monitoring
```

### **Database Optimization**
- Indexes are automatically created
- Regular cleanup of old analytics data
- Export/import functionality for backups

## 🔄 Updates and Maintenance

### **Regular Tasks**
1. **Backup Database**: Export contacts and data
2. **Update Dependencies**: `npm update`
3. **Monitor Logs**: Check for errors
4. **Security Updates**: Keep dependencies updated

### **Backup Database**
```bash
# Export all data
curl -H "Authorization: Bearer <token>" \
  http://localhost:3001/api/v1/admin/backup > backup.json
```

## 🎉 You're Ready!

Your photography platform now has:
- ✅ **Complete Backend API**
- ✅ **Database with automatic setup**
- ✅ **Email service configured**
- ✅ **Admin dashboard**
- ✅ **Security features**
- ✅ **Frontend integration**

### **Next Steps:**
1. **Customize**: Add your content and images
2. **Configure**: Set up your email service
3. **Deploy**: Choose your deployment option
4. **Monitor**: Set up monitoring and backups

### **Support:**
- **Documentation**: `http://localhost:3001/api/docs`
- **Health Check**: `http://localhost:3001/health`
- **Admin Panel**: `http://localhost:3000/admin`

Happy coding! 🚀
