import express from 'express';
import { body, validationResult, query } from 'express-validator';
import { getDatabase } from '../database/init.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all portfolio images (public)
router.get('/', [
  query('category').optional().isString(),
  query('featured').optional().isBoolean(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
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

    const category = req.query.category;
    const featured = req.query.featured === 'true';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const db = getDatabase();
    
    // Build query
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (category) {
      whereClause += ' AND category = ?';
      params.push(category);
    }

    if (featured) {
      whereClause += ' AND is_featured = 1';
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM portfolio_images ${whereClause}`;
    const totalResult = db.prepare(countQuery).get(...params);
    const total = totalResult.total;

    // Get portfolio images
    const imagesQuery = `
      SELECT * FROM portfolio_images 
      ${whereClause}
      ORDER BY sort_order ASC, created_at DESC 
      LIMIT ? OFFSET ?
    `;
    const images = db.prepare(imagesQuery).all(...params, limit, offset);

    res.json({
      success: true,
      data: {
        images,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get portfolio images error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get portfolio images by category (public)
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const db = getDatabase();
    
    const images = db.prepare(`
      SELECT * FROM portfolio_images 
      WHERE category = ? 
      ORDER BY sort_order ASC, created_at DESC
    `).all(category);

    res.json({
      success: true,
      data: { images }
    });

  } catch (error) {
    console.error('Get portfolio by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get featured portfolio images (public)
router.get('/featured', async (req, res) => {
  try {
    const db = getDatabase();
    
    const images = db.prepare(`
      SELECT * FROM portfolio_images 
      WHERE is_featured = 1 
      ORDER BY sort_order ASC, created_at DESC
    `).all();

    res.json({
      success: true,
      data: { images }
    });

  } catch (error) {
    console.error('Get featured portfolio error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single portfolio image (admin)
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    
    const image = db.prepare('SELECT * FROM portfolio_images WHERE id = ?').get(id);
    
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio image not found'
      });
    }

    res.json({
      success: true,
      data: { image }
    });

  } catch (error) {
    console.error('Get portfolio image error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create portfolio image (admin)
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('title').notEmpty().withMessage('Title is required'),
  body('image_url').notEmpty().withMessage('Image URL is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('description').optional().isString(),
  body('thumbnail_url').optional().isString(),
  body('is_featured').optional().isBoolean(),
  body('sort_order').optional().isInt(),
  body('tags').optional().isString()
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
      title,
      description,
      image_url,
      thumbnail_url,
      category,
      is_featured = false,
      sort_order = 0,
      tags
    } = req.body;

    const db = getDatabase();
    
    const stmt = db.prepare(`
      INSERT INTO portfolio_images (
        title, description, image_url, thumbnail_url, category, 
        is_featured, sort_order, tags
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      title, description, image_url, thumbnail_url, category,
      is_featured, sort_order, tags
    );

    const image = db.prepare('SELECT * FROM portfolio_images WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Portfolio image created successfully',
      data: { image }
    });

  } catch (error) {
    console.error('Create portfolio image error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update portfolio image (admin)
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  body('title').optional().notEmpty(),
  body('description').optional().isString(),
  body('image_url').optional().notEmpty(),
  body('thumbnail_url').optional().isString(),
  body('category').optional().notEmpty(),
  body('is_featured').optional().isBoolean(),
  body('sort_order').optional().isInt(),
  body('tags').optional().isString()
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
    const updates = req.body;
    const db = getDatabase();

    // Check if image exists
    const existingImage = db.prepare('SELECT * FROM portfolio_images WHERE id = ?').get(id);
    if (!existingImage) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio image not found'
      });
    }

    // Build update query
    const updateFields = [];
    const params = [];

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        updateFields.push(`${key} = ?`);
        params.push(updates[key]);
      }
    });

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const stmt = db.prepare(`UPDATE portfolio_images SET ${updateFields.join(', ')} WHERE id = ?`);
    stmt.run(...params);

    const updatedImage = db.prepare('SELECT * FROM portfolio_images WHERE id = ?').get(id);

    res.json({
      success: true,
      message: 'Portfolio image updated successfully',
      data: { image: updatedImage }
    });

  } catch (error) {
    console.error('Update portfolio image error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete portfolio image (admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    // Check if image exists
    const image = db.prepare('SELECT * FROM portfolio_images WHERE id = ?').get(id);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio image not found'
      });
    }

    // Delete image
    db.prepare('DELETE FROM portfolio_images WHERE id = ?').run(id);

    res.json({
      success: true,
      message: 'Portfolio image deleted successfully'
    });

  } catch (error) {
    console.error('Delete portfolio image error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get portfolio categories (public)
router.get('/categories/list', async (req, res) => {
  try {
    const db = getDatabase();
    
    const categories = db.prepare(`
      SELECT category, COUNT(*) as count 
      FROM portfolio_images 
      GROUP BY category 
      ORDER BY category
    `).all();

    res.json({
      success: true,
      data: { categories }
    });

  } catch (error) {
    console.error('Get portfolio categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
