import express from 'express';
import { body, validationResult } from 'express-validator';
import emailService from '../services/emailService.js';
import { getDatabase } from '../database/init.js';

const router = express.Router();

// Send contact email
router.post('/contact', [
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

    const contactData = req.body;
    
    // Send email
    const result = await emailService.sendContactEmail(contactData);
    
    if (result.success) {
      // Save contact to database
      const db = getDatabase();
      const stmt = db.prepare(`
        INSERT INTO contacts (
          full_name, email, phone, message, service_type, 
          budget_range, event_date, location, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new')
      `);
      
      stmt.run(
        contactData.full_name,
        contactData.email,
        contactData.phone,
        contactData.message,
        contactData.service_type,
        contactData.budget_range,
        contactData.event_date,
        contactData.location
      );

      res.json({
        success: true,
        message: 'Contact email sent successfully',
        data: result.data
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }

  } catch (error) {
    console.error('Send contact email error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Send newsletter signup email
router.post('/newsletter', [
  body('email').isEmail().withMessage('Valid email is required')
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

    const { email } = req.body;
    
    // Send email
    const result = await emailService.sendNewsletterSignup(email);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Newsletter signup processed successfully',
        data: result.data
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }

  } catch (error) {
    console.error('Send newsletter signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Test email service
router.post('/test', async (req, res) => {
  try {
    const testEmail = {
      from: process.env.EMAIL_FROM || 'Jeff Honforloco Photography <noreply@jeffhonforlocophotos.com>',
      to: process.env.ADMIN_EMAIL || 'jeff@jeffhonforlocophotos.com',
      subject: 'Email Service Test',
      html: `
        <h1>Email Service Test</h1>
        <p>This is a test email to verify that the email service is working correctly.</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `
    };

    const result = await emailService.transporter.sendMail(testEmail);
    
    res.json({
      success: true,
      message: 'Test email sent successfully',
      data: {
        messageId: result.messageId
      }
    });

  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: error.message
    });
  }
});

export default router;
