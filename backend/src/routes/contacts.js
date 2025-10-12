import express from 'express';
import { body, validationResult, query } from 'express-validator';
import { getDatabase } from '../database/init.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all contacts (admin only)
router.get('/', authenticateToken, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['new', 'contacted', 'qualified', 'booked', 'completed']).withMessage('Invalid status'),
  query('search').optional().isString().withMessage('Search must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const search = req.query.search;
    const offset = (page - 1) * limit;

    const db = getDatabase();
    
    // Build query
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (status) {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      whereClause += ' AND (full_name LIKE ? OR email LIKE ? OR message LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM contacts ${whereClause}`;
    const totalResult = db.prepare(countQuery).get(...params);
    const total = totalResult.total;

    // Get contacts
    const contactsQuery = `
      SELECT * FROM contacts 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `;
    const contacts = db.prepare(contactsQuery).all(...params, limit, offset);

    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single contact
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    
    const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      data: { contact }
    });

  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new contact (public endpoint)
router.post('/', [
  body('full_name').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').notEmpty().withMessage('Message is required'),
  body('phone').optional().isString(),
  body('service_type').optional().isString(),
  body('budget_range').optional().isString(),
  body('event_date').optional().isString(),
  body('location').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      full_name,
      email,
      phone,
      message,
      service_type,
      budget_range,
      event_date,
      location
    } = req.body;

    const db = getDatabase();
    
    const stmt = db.prepare(`
      INSERT INTO contacts (
        full_name, email, phone, message, service_type, 
        budget_range, event_date, location, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new')
    `);
    
    const result = stmt.run(
      full_name, email, phone, message, service_type,
      budget_range, event_date, location
    );

    const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Contact created successfully',
      data: { contact }
    });

  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update contact
router.put('/:id', [
  authenticateToken,
  body('status').optional().isIn(['new', 'contacted', 'qualified', 'booked', 'completed']),
  body('notes').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { status, notes } = req.body;
    const db = getDatabase();

    // Check if contact exists
    const existingContact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(id);
    if (!existingContact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    // Build update query
    const updates = [];
    const params = [];

    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }

    if (notes !== undefined) {
      updates.push('notes = ?');
      params.push(notes);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const stmt = db.prepare(`UPDATE contacts SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...params);

    const updatedContact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(id);

    res.json({
      success: true,
      message: 'Contact updated successfully',
      data: { contact: updatedContact }
    });

  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete contact
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    // Check if contact exists
    const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    // Delete contact
    db.prepare('DELETE FROM contacts WHERE id = ?').run(id);

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });

  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get contact statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const db = getDatabase();
    
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_contacts,
        COUNT(CASE WHEN status = 'new' THEN 1 END) as new_contacts,
        COUNT(CASE WHEN status = 'contacted' THEN 1 END) as contacted,
        COUNT(CASE WHEN status = 'qualified' THEN 1 END) as qualified,
        COUNT(CASE WHEN status = 'booked' THEN 1 END) as booked,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
        COUNT(CASE WHEN created_at >= date('now', '-30 days') THEN 1 END) as last_30_days
      FROM contacts
    `).get();

    res.json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    console.error('Get contact stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
