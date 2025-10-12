# 📊 Complete Data Migration Guide

This guide will help you migrate all your existing data from the Supabase setup to your new backend.

## 🎯 What Gets Migrated

### ✅ **All Existing Data**
- **Blog Posts**: All 6 blog posts from `public/data/blog-posts.json`
- **Portfolio Images**: All 100+ images from `src/data/portfolio-data.ts`
- **Contact Information**: Sample contacts with realistic data
- **Email Templates**: 8 professional email templates
- **Analytics Data**: Sample analytics events for testing
- **Email Sequences**: Automated email sequences

### ✅ **Data Sources**
- `public/data/blog-posts.json` → Blog posts table
- `src/data/portfolio-data.ts` → Portfolio images table
- `public/data/jeff-content.json` → User profile and settings
- Generated sample data → Contacts, analytics, email sequences

## 🚀 Quick Migration (2 Minutes)

### **1. Navigate to Backend Directory**
```bash
cd backend
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Run Migration**
```bash
# Comprehensive migration (recommended)
npm run migrate

# Or basic migration
npm run migrate:basic
```

### **4. Verify Migration**
```bash
# Check database
sqlite3 database/photography.db
.tables
SELECT COUNT(*) FROM blog_posts;
SELECT COUNT(*) FROM portfolio_images;
SELECT COUNT(*) FROM contacts;
.quit
```

## 📋 Detailed Migration Steps

### **Step 1: Blog Posts Migration**
```bash
# Migrates all blog posts from public/data/blog-posts.json
# Creates 6 blog posts with:
# - Titles, slugs, content, excerpts
# - Featured images
# - Categories and tags
# - Published status
```

### **Step 2: Portfolio Images Migration**
```bash
# Extracts and migrates all portfolio images from src/data/portfolio-data.ts
# Creates 100+ portfolio images across categories:
# - Beauty (20 images)
# - Fashion (20 images) 
# - Glamour (10 images)
# - Editorial (10 images)
# - Lifestyle (10 images)
# - Motion (6 videos)
```

### **Step 3: Email Templates Migration**
```bash
# Creates 8 professional email templates:
# - Welcome email
# - Contact confirmation
# - Newsletter signup
# - Behind the scenes
# - Booking offer
# - Follow-up sequences
```

### **Step 4: Sample Data Creation**
```bash
# Creates realistic sample data:
# - 6 sample contacts with different statuses
# - 15 analytics events
# - 3 email sequences
# - User profiles and settings
```

## 🔍 Migration Scripts Explained

### **Main Migration Script: `migrate-from-json.js`**
- **Purpose**: Comprehensive data migration from JSON files
- **Features**: 
  - Duplicate checking
  - Error handling
  - Progress logging
  - Data validation

### **Portfolio Extractor: `extract-portfolio-data.js`**
- **Purpose**: Extract portfolio data from TypeScript file
- **Features**:
  - Parse TypeScript object syntax
  - Convert to JSON format
  - Handle video and image content

### **Basic Migration: `migrate-data.js`**
- **Purpose**: Simple migration with basic data extraction
- **Features**:
  - Direct TypeScript parsing
  - Basic error handling
  - Minimal dependencies

## 📊 Data Structure After Migration

### **Blog Posts Table**
```sql
-- 6 blog posts with:
- id, title, slug, content, excerpt
- featured_image_url, author_id
- status (published), published_at
- tags, metadata, created_at, updated_at
```

### **Portfolio Images Table**
```sql
-- 100+ portfolio images with:
- id, title, description, image_url, thumbnail_url
- category (beauty, fashion, glamour, editorial, lifestyle, motion)
- is_featured, sort_order, tags, metadata
- created_at, updated_at
```

### **Contacts Table**
```sql
-- 6 sample contacts with:
- id, full_name, email, phone, message
- service_type, budget_range, event_date, location
- status (new, contacted, qualified, booked, completed)
- notes, created_at, updated_at
```

### **Email Templates Table**
```sql
-- 8 email templates with:
- id, name, subject, content
- is_active, created_at, updated_at
```

### **Analytics Table**
```sql
-- 15 analytics events with:
- id, event_type, event_data
- user_agent, ip_address, referrer
- created_at
```

## 🛠️ Manual Migration (If Scripts Fail)

### **1. Export Data from Supabase Dashboard**
```sql
-- If you have existing Supabase data:
SELECT * FROM blog_posts;
SELECT * FROM portfolio_images;
SELECT * FROM contacts;
```

### **2. Import to New Backend**
```bash
# Use the admin API endpoints
curl -X POST http://localhost:3001/api/v1/blog \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Your Blog Post", "content": "...", "slug": "your-slug"}'
```

### **3. Bulk Import Script**
```javascript
// Create a custom import script
const data = JSON.parse(fs.readFileSync('exported-data.json', 'utf8'));

for (const post of data.blog_posts) {
  // Import blog posts
}

for (const image of data.portfolio_images) {
  // Import portfolio images
}
```

## 🔧 Troubleshooting

### **Common Issues**

#### **Migration Script Fails**
```bash
# Check Node.js version
node --version  # Should be 18+

# Check file permissions
ls -la src/scripts/

# Run with debug
DEBUG=* npm run migrate
```

#### **Portfolio Data Not Found**
```bash
# Extract portfolio data first
npm run extract:portfolio

# Then run migration
npm run migrate
```

#### **Database Connection Issues**
```bash
# Check database file
ls -la database/

# Reset database
rm -rf database/
npm run migrate
```

#### **Missing Dependencies**
```bash
# Install missing packages
npm install

# Check for TypeScript issues
npm install -g typescript
```

### **Data Validation**

#### **Check Blog Posts**
```sql
SELECT COUNT(*) as total_posts, 
       COUNT(CASE WHEN status = 'published' THEN 1 END) as published
FROM blog_posts;
```

#### **Check Portfolio Images**
```sql
SELECT category, COUNT(*) as count 
FROM portfolio_images 
GROUP BY category;
```

#### **Check Contacts**
```sql
SELECT status, COUNT(*) as count 
FROM contacts 
GROUP BY status;
```

## 📈 Post-Migration Steps

### **1. Verify Data Integrity**
```bash
# Check all tables have data
sqlite3 database/photography.db "SELECT 'blog_posts' as table_name, COUNT(*) as count FROM blog_posts UNION ALL SELECT 'portfolio_images', COUNT(*) FROM portfolio_images UNION ALL SELECT 'contacts', COUNT(*) FROM contacts;"
```

### **2. Test API Endpoints**
```bash
# Test blog posts
curl http://localhost:3001/api/v1/blog

# Test portfolio
curl http://localhost:3001/api/v1/portfolio

# Test contacts (requires auth)
curl -H "Authorization: Bearer <token>" http://localhost:3001/api/v1/contacts
```

### **3. Update Frontend**
```bash
# Ensure frontend is pointing to new backend
# Check .env.local file
VITE_API_BASE_URL=http://localhost:3001/api/v1
```

### **4. Test Full Integration**
1. **Start Backend**: `npm run dev`
2. **Start Frontend**: `npm run dev`
3. **Test Contact Form**: Submit a test contact
4. **Test Blog**: View blog posts
5. **Test Portfolio**: Browse portfolio images
6. **Test Admin**: Login to admin panel

## 🎉 Success Indicators

### **✅ Migration Successful If:**
- ✅ Blog posts visible in frontend
- ✅ Portfolio images loading correctly
- ✅ Contact form submissions working
- ✅ Admin dashboard showing data
- ✅ Email templates created
- ✅ Analytics data present

### **📊 Expected Data Counts:**
- **Blog Posts**: 6
- **Portfolio Images**: 100+
- **Contacts**: 6
- **Email Templates**: 8
- **Analytics Events**: 15
- **Email Sequences**: 3

## 🔄 Backup and Recovery

### **Backup Database**
```bash
# Create backup
cp database/photography.db database/photography-backup-$(date +%Y%m%d).db

# Export data
sqlite3 database/photography.db ".dump" > backup.sql
```

### **Restore Database**
```bash
# Restore from backup
cp database/photography-backup-YYYYMMDD.db database/photography.db

# Or restore from SQL
sqlite3 database/photography.db < backup.sql
```

## 🚀 Next Steps After Migration

1. **Configure Email Service**: Set up Gmail/SMTP
2. **Test All Functionality**: Contact forms, admin panel
3. **Customize Content**: Update blog posts, portfolio
4. **Deploy to Production**: Choose hosting platform
5. **Set Up Monitoring**: Analytics and error tracking

Your photography platform now has all the data from your Supabase setup migrated to your new backend! 🎉
