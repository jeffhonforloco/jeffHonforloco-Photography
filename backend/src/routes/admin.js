const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();
const DB_PATH = process.env.DATABASE_URL || path.resolve(__dirname, '../database/database.sqlite');

// Admin Dashboard - Get overview statistics
router.get('/dashboard', protect, authorize(['admin']), (req, res) => {
  const db = new sqlite3.Database(DB_PATH);
  
  // Get multiple statistics in parallel
  const stats = {};
  let completed = 0;
  const totalQueries = 6;
  
  const checkComplete = () => {
    completed++;
    if (completed === totalQueries) {
      res.json({
        success: true,
        data: {
          overview: stats,
          recentActivity: stats.recentActivity || [],
          performance: stats.performance || {}
        }
      });
      db.close();
    }
  };

  // Total contacts
  db.get('SELECT COUNT(*) as total FROM contacts', [], (err, row) => {
    if (err) {
      console.error('Error getting contacts count:', err.message);
      stats.contacts = { total: 0, new: 0, contacted: 0, qualified: 0, booked: 0, completed: 0 };
    } else {
      stats.contacts = { total: row.total };
    }
    checkComplete();
  });

  // Contact status breakdown
  db.all('SELECT status, COUNT(*) as count FROM contacts GROUP BY status', [], (err, rows) => {
    if (!err && rows) {
      const statusCounts = {};
      rows.forEach(row => {
        statusCounts[row.status] = row.count;
      });
      stats.contacts = { ...stats.contacts, ...statusCounts };
    }
    checkComplete();
  });

  // Total blog posts
  db.get('SELECT COUNT(*) as total FROM blog_posts', [], (err, row) => {
    if (err) {
      console.error('Error getting blog posts count:', err.message);
      stats.blogPosts = { total: 0, published: 0, draft: 0 };
    } else {
      stats.blogPosts = { total: row.total };
    }
    checkComplete();
  });

  // Blog post status breakdown
  db.all('SELECT status, COUNT(*) as count FROM blog_posts GROUP BY status', [], (err, rows) => {
    if (!err && rows) {
      const statusCounts = {};
      rows.forEach(row => {
        statusCounts[row.status] = row.count;
      });
      stats.blogPosts = { ...stats.blogPosts, ...statusCounts };
    }
    checkComplete();
  });

  // Total portfolio images
  db.get('SELECT COUNT(*) as total FROM portfolio_images', [], (err, row) => {
    if (err) {
      console.error('Error getting portfolio count:', err.message);
      stats.portfolioImages = { total: 0, featured: 0 };
    } else {
      stats.portfolioImages = { total: row.total };
    }
    checkComplete();
  });

  // Featured portfolio images
  db.get('SELECT COUNT(*) as featured FROM portfolio_images WHERE is_featured = 1', [], (err, row) => {
    if (!err && row) {
      stats.portfolioImages = { ...stats.portfolioImages, featured: row.featured };
    }
    checkComplete();
  });

  // Recent activity (last 10 activities)
  db.all(`
    SELECT 'contact' as type, full_name as title, created_at, status 
    FROM contacts 
    UNION ALL
    SELECT 'blog' as type, title, created_at, status 
    FROM blog_posts 
    ORDER BY created_at DESC 
    LIMIT 10
  `, [], (err, rows) => {
    if (!err && rows) {
      stats.recentActivity = rows;
    }
    checkComplete();
  });
});

// Analytics - Get detailed analytics data
router.get('/analytics', protect, authorize(['admin']), (req, res) => {
  const db = new sqlite3.Database(DB_PATH);
  const { period = '30d', type = 'all' } = req.query;
  
  let dateFilter = '';
  const now = new Date();
  
  switch (period) {
    case '7d':
      dateFilter = `WHERE created_at >= datetime('now', '-7 days')`;
      break;
    case '30d':
      dateFilter = `WHERE created_at >= datetime('now', '-30 days')`;
      break;
    case '90d':
      dateFilter = `WHERE created_at >= datetime('now', '-90 days')`;
      break;
    case '1y':
      dateFilter = `WHERE created_at >= datetime('now', '-1 year')`;
      break;
    default:
      dateFilter = `WHERE created_at >= datetime('now', '-30 days')`;
  }

  // Get analytics data
  db.all(`
    SELECT 
      event_type,
      COUNT(*) as count,
      DATE(created_at) as date
    FROM analytics 
    ${dateFilter}
    GROUP BY event_type, DATE(created_at)
    ORDER BY date DESC
  `, [], (err, rows) => {
    if (err) {
      console.error('Error getting analytics:', err.message);
      return res.status(500).json({ success: false, message: err.message });
    }

    // Process analytics data
    const analyticsData = {
      pageViews: 0,
      contactForms: 0,
      newsletterSignups: 0,
      portfolioViews: 0,
      blogViews: 0,
      dailyData: {}
    };

    rows.forEach(row => {
      const date = row.date;
      if (!analyticsData.dailyData[date]) {
        analyticsData.dailyData[date] = {};
      }
      
      analyticsData.dailyData[date][row.event_type] = row.count;
      
      switch (row.event_type) {
        case 'page_view':
          analyticsData.pageViews += row.count;
          break;
        case 'contact_form':
          analyticsData.contactForms += row.count;
          break;
        case 'newsletter_signup':
          analyticsData.newsletterSignups += row.count;
          break;
        case 'portfolio_view':
          analyticsData.portfolioViews += row.count;
          break;
        case 'blog_view':
          analyticsData.blogViews += row.count;
          break;
      }
    });

    res.json({
      success: true,
      data: analyticsData
    });
    db.close();
  });
});

// Export data - Export contacts, blog posts, etc.
router.get('/export/:type', protect, authorize(['admin']), (req, res) => {
  const { type } = req.params;
  const { format = 'json' } = req.query;
  const db = new sqlite3.Database(DB_PATH);

  let query = '';
  let filename = '';

  switch (type) {
    case 'contacts':
      query = 'SELECT * FROM contacts ORDER BY created_at DESC';
      filename = 'contacts';
      break;
    case 'blog':
      query = 'SELECT * FROM blog_posts ORDER BY created_at DESC';
      filename = 'blog_posts';
      break;
    case 'portfolio':
      query = 'SELECT * FROM portfolio_images ORDER BY created_at DESC';
      filename = 'portfolio_images';
      break;
    case 'analytics':
      query = 'SELECT * FROM analytics ORDER BY created_at DESC';
      filename = 'analytics';
      break;
    default:
      return res.status(400).json({ success: false, message: 'Invalid export type' });
  }

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error exporting data:', err.message);
      return res.status(500).json({ success: false, message: err.message });
    }

    if (format === 'csv') {
      // Convert to CSV
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'No data to export' });
      }

      const headers = Object.keys(rows[0]);
      const csvContent = [
        headers.join(','),
        ...rows.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      res.send(csvContent);
    } else {
      // Return JSON
      res.json({
        success: true,
        data: rows,
        count: rows.length,
        exported_at: new Date().toISOString()
      });
    }
    db.close();
  });
});

// System health check
router.get('/health', protect, authorize(['admin']), (req, res) => {
  const db = new sqlite3.Database(DB_PATH);
  
  // Check database connection
  db.get('SELECT 1 as test', [], (err, row) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Database connection failed',
        health: {
          database: 'unhealthy',
          timestamp: new Date().toISOString()
        }
      });
    }

    // Check disk space (basic check)
    const fs = require('fs');
    const stats = fs.statSync(DB_PATH);
    const fileSize = stats.size;
    
    res.json({
      success: true,
      health: {
        database: 'healthy',
        fileSize: fileSize,
        timestamp: new Date().toISOString()
      }
    });
    db.close();
  });
});

// Admin settings
router.get('/settings', protect, authorize(['admin']), (req, res) => {
  res.json({
    success: true,
    data: {
      siteName: 'Jeff Honforloco Photography',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      features: {
        blog: true,
        portfolio: true,
        contact: true,
        analytics: true,
        email: true
      },
      limits: {
        maxContacts: 10000,
        maxBlogPosts: 1000,
        maxPortfolioImages: 5000,
        maxFileSize: '10MB'
      }
    }
  });
});

// Update admin settings
router.put('/settings', protect, authorize(['admin']), (req, res) => {
  const { siteName, features, limits } = req.body;
  
  // In a real application, you'd save these to a settings table
  // For now, we'll just return success
  res.json({
    success: true,
    message: 'Settings updated successfully',
    data: {
      siteName: siteName || 'Jeff Honforloco Photography',
      features: features || {},
      limits: limits || {}
    }
  });
});

// Admin user management
router.get('/users', protect, authorize(['admin']), (req, res) => {
  const db = new sqlite3.Database(DB_PATH);
  
  db.all('SELECT id, username, role, is_active, created_at FROM users ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      console.error('Error getting users:', err.message);
      return res.status(500).json({ success: false, message: err.message });
    }

    res.json({
      success: true,
      data: rows
    });
    db.close();
  });
});

// Create new admin user
router.post('/users', protect, authorize(['admin']), (req, res) => {
  const { username, password, role = 'admin' } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  const bcrypt = require('bcryptjs');
  const hashedPassword = bcrypt.hashSync(password, 10);
  
  const db = new sqlite3.Database(DB_PATH);
  db.run(
    'INSERT INTO users (username, password, role, is_active) VALUES (?, ?, ?, ?)',
    [username, hashedPassword, role, 1],
    function (err) {
      if (err) {
        console.error('Error creating user:', err.message);
        return res.status(500).json({ success: false, message: err.message });
      }

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: { id: this.lastID, username, role }
      });
      db.close();
    }
  );
});

// Update user
router.put('/users/:id', protect, authorize(['admin']), (req, res) => {
  const { id } = req.params;
  const { username, role, is_active } = req.body;
  
  const db = new sqlite3.Database(DB_PATH);
  db.run(
    'UPDATE users SET username = ?, role = ?, is_active = ? WHERE id = ?',
    [username, role, is_active, id],
    function (err) {
      if (err) {
        console.error('Error updating user:', err.message);
        return res.status(500).json({ success: false, message: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.json({
        success: true,
        message: 'User updated successfully'
      });
      db.close();
    }
  );
});

// Delete user
router.delete('/users/:id', protect, authorize(['admin']), (req, res) => {
  const { id } = req.params;
  
  const db = new sqlite3.Database(DB_PATH);
  db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
    if (err) {
      console.error('Error deleting user:', err.message);
      return res.status(500).json({ success: false, message: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
    db.close();
  });
});

module.exports = router;