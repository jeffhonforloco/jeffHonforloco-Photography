const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { adminAuth, adminRateLimit, logAdminActivity, adminSession } = require('../middleware/adminAuth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const DB_PATH = process.env.DATABASE_URL || path.resolve(__dirname, '../database/database.sqlite');

// Admin login
router.post('/login', adminRateLimit, (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Username and password are required',
      code: 'MISSING_CREDENTIALS'
    });
  }

  const db = new sqlite3.Database(DB_PATH);
  db.get(
    'SELECT * FROM users WHERE username = ? AND is_active = 1',
    [username],
    async (err, user) => {
      if (err) {
        console.error('Database error during login:', err.message);
        return res.status(500).json({ 
          success: false, 
          message: 'Internal server error',
          code: 'DATABASE_ERROR'
        });
      }

      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS'
        });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS'
        });
      }

      // Check if user has admin role
      if (user.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          message: 'Access denied. Admin privileges required.',
          code: 'INSUFFICIENT_PRIVILEGES'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          username: user.username, 
          role: user.role 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Update last login
      db.run(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
        [user.id],
        (err) => {
          if (err) {
            console.error('Error updating last login:', err.message);
          }
        }
      );

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            role: user.role,
            last_login: user.last_login
          }
        }
      });
      db.close();
    }
  );
});

// Admin logout
router.post('/logout', adminAuth, (req, res) => {
  // In a real application, you might want to blacklist the token
  // For now, we'll just return success
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// Verify admin token
router.get('/verify', adminAuth, (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    data: {
      user: {
        id: req.user.id,
        username: req.user.username,
        role: req.user.role
      }
    }
  });
});

// Refresh admin token
router.post('/refresh', adminAuth, (req, res) => {
  // Generate new token
  const token = jwt.sign(
    { 
      id: req.user.id, 
      username: req.user.username, 
      role: req.user.role 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    message: 'Token refreshed successfully',
    data: {
      token
    }
  });
});

// Change admin password
router.put('/change-password', adminAuth, adminRateLimit, (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ 
      success: false, 
      message: 'Current password and new password are required',
      code: 'MISSING_PASSWORDS'
    });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ 
      success: false, 
      message: 'New password must be at least 8 characters long',
      code: 'WEAK_PASSWORD'
    });
  }

  const db = new sqlite3.Database(DB_PATH);
  db.get(
    'SELECT password FROM users WHERE id = ?',
    [req.user.id],
    async (err, user) => {
      if (err) {
        console.error('Database error during password change:', err.message);
        return res.status(500).json({ 
          success: false, 
          message: 'Internal server error',
          code: 'DATABASE_ERROR'
        });
      }

      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ 
          success: false, 
          message: 'Current password is incorrect',
          code: 'INVALID_CURRENT_PASSWORD'
        });
      }

      // Hash new password
      const hashedPassword = bcrypt.hashSync(newPassword, 10);

      // Update password
      db.run(
        'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [hashedPassword, req.user.id],
        function (err) {
          if (err) {
            console.error('Error updating password:', err.message);
            return res.status(500).json({ 
              success: false, 
              message: 'Failed to update password',
              code: 'UPDATE_FAILED'
            });
          }

          res.json({
            success: true,
            message: 'Password changed successfully'
          });
          db.close();
        }
      );
    }
  );
});

// Get admin profile
router.get('/profile', adminAuth, (req, res) => {
  const db = new sqlite3.Database(DB_PATH);
  
  db.get(
    'SELECT id, username, role, created_at, last_login, last_activity FROM users WHERE id = ?',
    [req.user.id],
    (err, user) => {
      if (err) {
        console.error('Error getting admin profile:', err.message);
        return res.status(500).json({ 
          success: false, 
          message: 'Internal server error',
          code: 'DATABASE_ERROR'
        });
      }

      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          username: user.username,
          role: user.role,
          created_at: user.created_at,
          last_login: user.last_login,
          last_activity: user.last_activity
        }
      });
      db.close();
    }
  );
});

// Update admin profile
router.put('/profile', adminAuth, adminRateLimit, (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ 
      success: false, 
      message: 'Username is required',
      code: 'MISSING_USERNAME'
    });
  }

  const db = new sqlite3.Database(DB_PATH);
  db.run(
    'UPDATE users SET username = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [username, req.user.id],
    function (err) {
      if (err) {
        console.error('Error updating profile:', err.message);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to update profile',
          code: 'UPDATE_FAILED'
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          username: username
        }
      });
      db.close();
    }
  );
});

// Get admin activity log
router.get('/activity', adminAuth, (req, res) => {
  const { limit = 50, offset = 0 } = req.query;
  const db = new sqlite3.Database(DB_PATH);
  
  db.all(
    'SELECT * FROM admin_activity ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [limit, offset],
    (err, rows) => {
      if (err) {
        console.error('Error getting admin activity:', err.message);
        return res.status(500).json({ 
          success: false, 
          message: 'Internal server error',
          code: 'DATABASE_ERROR'
        });
      }

      res.json({
        success: true,
        data: rows,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: rows.length
        }
      });
      db.close();
    }
  );
});

// Apply middleware to all routes
router.use(adminSession);
router.use(logAdminActivity);

module.exports = router;
