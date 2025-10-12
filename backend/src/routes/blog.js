import express from 'express';
import { body, validationResult, query } from 'express-validator';
import { getDatabase } from '../database/init.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all blog posts (public)
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('status').optional().isIn(['draft', 'published']).withMessage('Invalid status'),
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
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || 'published'; // Default to published for public
    const search = req.query.search;
    const offset = (page - 1) * limit;

    const db = getDatabase();
    
    // Build query
    let whereClause = 'WHERE status = ?';
    const params = [status];

    if (search) {
      whereClause += ' AND (title LIKE ? OR content LIKE ? OR tags LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM blog_posts ${whereClause}`;
    const totalResult = db.prepare(countQuery).get(...params);
    const total = totalResult.total;

    // Get blog posts
    const postsQuery = `
      SELECT id, title, slug, excerpt, featured_image_url, author_id, 
             status, published_at, tags, created_at, updated_at
      FROM blog_posts 
      ${whereClause}
      ORDER BY published_at DESC, created_at DESC 
      LIMIT ? OFFSET ?
    `;
    const posts = db.prepare(postsQuery).all(...params, limit, offset);

    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single blog post by slug (public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const db = getDatabase();
    
    const post = db.prepare(`
      SELECT b.*, u.username as author_name 
      FROM blog_posts b 
      LEFT JOIN users u ON b.author_id = u.id 
      WHERE b.slug = ? AND b.status = 'published'
    `).get(slug);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.json({
      success: true,
      data: { post }
    });

  } catch (error) {
    console.error('Get blog post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single blog post by ID (admin)
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    
    const post = db.prepare(`
      SELECT b.*, u.username as author_name 
      FROM blog_posts b 
      LEFT JOIN users u ON b.author_id = u.id 
      WHERE b.id = ?
    `).get(id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.json({
      success: true,
      data: { post }
    });

  } catch (error) {
    console.error('Get blog post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create blog post (admin)
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('slug').notEmpty().withMessage('Slug is required'),
  body('excerpt').optional().isString(),
  body('featured_image_url').optional().isString(),
  body('status').optional().isIn(['draft', 'published']),
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
      content,
      slug,
      excerpt,
      featured_image_url,
      status = 'draft',
      tags
    } = req.body;

    const db = getDatabase();
    
    // Check if slug already exists
    const existingPost = db.prepare('SELECT id FROM blog_posts WHERE slug = ?').get(slug);
    if (existingPost) {
      return res.status(400).json({
        success: false,
        message: 'Slug already exists'
      });
    }

    const stmt = db.prepare(`
      INSERT INTO blog_posts (
        title, content, slug, excerpt, featured_image_url, 
        author_id, status, published_at, tags
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const publishedAt = status === 'published' ? new Date().toISOString() : null;
    
    const result = stmt.run(
      title, content, slug, excerpt, featured_image_url,
      req.user.id, status, publishedAt, tags
    );

    const post = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: { post }
    });

  } catch (error) {
    console.error('Create blog post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update blog post (admin)
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  body('title').optional().notEmpty(),
  body('content').optional().notEmpty(),
  body('slug').optional().notEmpty(),
  body('excerpt').optional().isString(),
  body('featured_image_url').optional().isString(),
  body('status').optional().isIn(['draft', 'published']),
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

    // Check if post exists
    const existingPost = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(id);
    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Check slug uniqueness if slug is being updated
    if (updates.slug && updates.slug !== existingPost.slug) {
      const slugExists = db.prepare('SELECT id FROM blog_posts WHERE slug = ? AND id != ?').get(updates.slug, id);
      if (slugExists) {
        return res.status(400).json({
          success: false,
          message: 'Slug already exists'
        });
      }
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

    if (updates.status === 'published' && existingPost.status === 'draft') {
      updateFields.push('published_at = ?');
      params.push(new Date().toISOString());
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const stmt = db.prepare(`UPDATE blog_posts SET ${updateFields.join(', ')} WHERE id = ?`);
    stmt.run(...params);

    const updatedPost = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(id);

    res.json({
      success: true,
      message: 'Blog post updated successfully',
      data: { post: updatedPost }
    });

  } catch (error) {
    console.error('Update blog post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete blog post (admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    // Check if post exists
    const post = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Delete post
    db.prepare('DELETE FROM blog_posts WHERE id = ?').run(id);

    res.json({
      success: true,
      message: 'Blog post deleted successfully'
    });

  } catch (error) {
    console.error('Delete blog post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
