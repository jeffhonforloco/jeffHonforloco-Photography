import express from 'express';
import { getDatabase } from '../database/init.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Get dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const db = getDatabase();
    
    // Get various statistics
    const stats = db.prepare(`
      SELECT 
        (SELECT COUNT(*) FROM contacts) as total_contacts,
        (SELECT COUNT(*) FROM contacts WHERE status = 'new') as new_contacts,
        (SELECT COUNT(*) FROM contacts WHERE created_at >= date('now', '-30 days')) as contacts_last_30_days,
        (SELECT COUNT(*) FROM blog_posts WHERE status = 'published') as published_posts,
        (SELECT COUNT(*) FROM blog_posts WHERE status = 'draft') as draft_posts,
        (SELECT COUNT(*) FROM portfolio_images) as total_images,
        (SELECT COUNT(*) FROM portfolio_images WHERE is_featured = 1) as featured_images
    `).get();

    // Get recent contacts
    const recentContacts = db.prepare(`
      SELECT id, full_name, email, service_type, status, created_at 
      FROM contacts 
      ORDER BY created_at DESC 
      LIMIT 5
    `).all();

    // Get recent blog posts
    const recentPosts = db.prepare(`
      SELECT id, title, status, created_at 
      FROM blog_posts 
      ORDER BY created_at DESC 
      LIMIT 5
    `).all();

    res.json({
      success: true,
      data: {
        stats,
        recentContacts,
        recentPosts
      }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get analytics data
router.get('/analytics', async (req, res) => {
  try {
    const db = getDatabase();
    
    // Contact analytics
    const contactStats = db.prepare(`
      SELECT 
        status,
        COUNT(*) as count
      FROM contacts 
      GROUP BY status
    `).all();

    // Monthly contact trends
    const monthlyContacts = db.prepare(`
      SELECT 
        strftime('%Y-%m', created_at) as month,
        COUNT(*) as count
      FROM contacts 
      WHERE created_at >= date('now', '-12 months')
      GROUP BY strftime('%Y-%m', created_at)
      ORDER BY month
    `).all();

    // Service type analytics
    const serviceStats = db.prepare(`
      SELECT 
        service_type,
        COUNT(*) as count
      FROM contacts 
      WHERE service_type IS NOT NULL
      GROUP BY service_type
      ORDER BY count DESC
    `).all();

    res.json({
      success: true,
      data: {
        contactStats,
        monthlyContacts,
        serviceStats
      }
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Export data
router.get('/export/contacts', async (req, res) => {
  try {
    const db = getDatabase();
    
    const contacts = db.prepare(`
      SELECT 
        full_name,
        email,
        phone,
        service_type,
        budget_range,
        event_date,
        location,
        status,
        created_at
      FROM contacts 
      ORDER BY created_at DESC
    `).all();

    // Convert to CSV format
    const csvHeaders = [
      'Full Name', 'Email', 'Phone', 'Service Type', 'Budget Range',
      'Event Date', 'Location', 'Status', 'Created At'
    ].join(',');

    const csvRows = contacts.map(contact => [
      contact.full_name,
      contact.email,
      contact.phone || '',
      contact.service_type || '',
      contact.budget_range || '',
      contact.event_date || '',
      contact.location || '',
      contact.status,
      contact.created_at
    ].map(field => `"${field}"`).join(','));

    const csvContent = [csvHeaders, ...csvRows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=contacts-export.csv');
    res.send(csvContent);

  } catch (error) {
    console.error('Export contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get system information
router.get('/system', async (req, res) => {
  try {
    const db = getDatabase();
    
    // Database size
    const dbSize = db.prepare('PRAGMA page_count').get();
    const pageSize = db.prepare('PRAGMA page_size').get();
    const totalSize = dbSize.page_count * pageSize.page_size;

    // Table sizes
    const tableSizes = db.prepare(`
      SELECT 
        name,
        (SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name=main.name) as row_count
      FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `).all();

    const systemInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      databaseSize: totalSize,
      tableSizes,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      data: systemInfo
    });

  } catch (error) {
    console.error('Get system info error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Backup database
router.post('/backup', async (req, res) => {
  try {
    const db = getDatabase();
    
    // Get all data
    const contacts = db.prepare('SELECT * FROM contacts').all();
    const blogPosts = db.prepare('SELECT * FROM blog_posts').all();
    const portfolioImages = db.prepare('SELECT * FROM portfolio_images').all();
    const users = db.prepare('SELECT id, username, email, role, created_at, updated_at FROM users').all();

    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      data: {
        contacts,
        blogPosts,
        portfolioImages,
        users
      }
    };

    res.json({
      success: true,
      message: 'Backup created successfully',
      data: backup
    });

  } catch (error) {
    console.error('Backup database error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Clear old analytics data
router.delete('/analytics/cleanup', async (req, res) => {
  try {
    const db = getDatabase();
    
    // Delete analytics data older than 1 year
    const result = db.prepare(`
      DELETE FROM analytics 
      WHERE created_at < date('now', '-1 year')
    `).run();

    res.json({
      success: true,
      message: `Cleaned up ${result.changes} old analytics records`
    });

  } catch (error) {
    console.error('Cleanup analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
