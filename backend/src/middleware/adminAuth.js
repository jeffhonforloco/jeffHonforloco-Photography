const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const JWT_SECRET = process.env.JWT_SECRET;
const DB_PATH = process.env.DATABASE_URL || path.resolve(__dirname, '../database/database.sqlite');

// Enhanced admin authentication middleware
const adminAuth = (req, res, next) => {
  let token;

  // Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access denied. No token provided.',
      code: 'NO_TOKEN'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if user exists and is active
    const db = new sqlite3.Database(DB_PATH);
    db.get(
      'SELECT id, username, role, is_active FROM users WHERE id = ? AND is_active = 1',
      [decoded.id],
      (err, user) => {
        if (err) {
          console.error('Database error during admin auth:', err.message);
          return res.status(500).json({ 
            success: false, 
            message: 'Internal server error',
            code: 'DATABASE_ERROR'
          });
        }

        if (!user) {
          return res.status(401).json({ 
            success: false, 
            message: 'Invalid token or user not found',
            code: 'INVALID_TOKEN'
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

        // Add user info to request
        req.user = {
          id: user.id,
          username: user.username,
          role: user.role
        };

        next();
        db.close();
      }
    );
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    } else {
      return res.status(401).json({ 
        success: false, 
        message: 'Token verification failed',
        code: 'TOKEN_VERIFICATION_FAILED'
      });
    }
  }
};

// Rate limiting for admin endpoints
const adminRateLimit = (req, res, next) => {
  // Simple in-memory rate limiting
  const rateLimitMap = new Map();
  const clientId = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100; // 100 requests per 15 minutes

  if (!rateLimitMap.has(clientId)) {
    rateLimitMap.set(clientId, { count: 1, resetTime: now + windowMs });
    return next();
  }

  const clientData = rateLimitMap.get(clientId);
  
  if (now > clientData.resetTime) {
    clientData.count = 1;
    clientData.resetTime = now + windowMs;
    return next();
  }

  if (clientData.count >= maxRequests) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
    });
  }

  clientData.count++;
  next();
};

// Admin activity logging
const logAdminActivity = (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    // Log admin activity
    const activity = {
      user_id: req.user?.id,
      username: req.user?.username,
      action: req.method + ' ' + req.originalUrl,
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.get('User-Agent'),
      timestamp: new Date().toISOString(),
      success: res.statusCode < 400
    };

    // Log to database
    const db = new sqlite3.Database(DB_PATH);
    db.run(
      'INSERT INTO admin_activity (user_id, action, ip_address, user_agent, success, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [activity.user_id, activity.action, activity.ip_address, activity.user_agent, activity.success, activity.timestamp],
      (err) => {
        if (err) {
          console.error('Error logging admin activity:', err.message);
        }
        db.close();
      }
    );

    // Call original send
    originalSend.call(this, data);
  };

  next();
};

// Admin session management
const adminSession = (req, res, next) => {
  // Check if user has valid session
  if (req.user) {
    // Update last activity
    const db = new sqlite3.Database(DB_PATH);
    db.run(
      'UPDATE users SET last_activity = CURRENT_TIMESTAMP WHERE id = ?',
      [req.user.id],
      (err) => {
        if (err) {
          console.error('Error updating last activity:', err.message);
        }
        db.close();
      }
    );
  }

  next();
};

module.exports = {
  adminAuth,
  adminRateLimit,
  logAdminActivity,
  adminSession
};
