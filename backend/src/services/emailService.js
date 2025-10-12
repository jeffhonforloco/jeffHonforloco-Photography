import nodemailer from 'nodemailer';
import { getDatabase } from '../database/init.js';

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    try {
      // Create transporter based on environment configuration
      if (process.env.EMAIL_SERVICE === 'gmail') {
        this.transporter = nodemailer.createTransporter({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
      } else {
        // SMTP configuration
        this.transporter = nodemailer.createTransporter({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });
      }

      // Verify connection
      this.transporter.verify((error, success) => {
        if (error) {
          console.error('❌ Email service connection failed:', error);
        } else {
          console.log('✅ Email service connected successfully');
        }
      });

    } catch (error) {
      console.error('❌ Email service initialization failed:', error);
    }
  }

  async sendContactEmail(contactData) {
    try {
      const { full_name, email, phone, message, service_type, budget_range, event_date, location } = contactData;
      
      const emailToJeff = {
        from: process.env.EMAIL_FROM || 'Jeff Honforloco Photography <noreply@jeffhonforlocophotos.com>',
        to: process.env.ADMIN_EMAIL || 'jeff@jeffhonforlocophotos.com',
        subject: `New Contact Inquiry from ${full_name}`,
        html: this.generateContactEmailHtml({
          full_name, email, phone, message, service_type, budget_range, event_date, location
        })
      };

      const confirmationEmail = {
        from: process.env.EMAIL_FROM || 'Jeff Honforloco Photography <noreply@jeffhonforlocophotos.com>',
        to: email,
        subject: 'Thank you for your inquiry!',
        html: this.generateConfirmationEmailHtml(full_name)
      };

      // Send email to Jeff
      const jeffEmailResult = await this.transporter.sendMail(emailToJeff);
      console.log('✅ Email to Jeff sent:', jeffEmailResult.messageId);

      // Send confirmation email to client
      const confirmationResult = await this.transporter.sendMail(confirmationEmail);
      console.log('✅ Confirmation email sent:', confirmationResult.messageId);

      return {
        success: true,
        message: 'Emails sent successfully',
        data: {
          jeffEmailId: jeffEmailResult.messageId,
          confirmationEmailId: confirmationResult.messageId
        }
      };

    } catch (error) {
      console.error('❌ Send contact email error:', error);
      return {
        success: false,
        message: 'Failed to send email',
        error: error.message
      };
    }
  }

  async sendNewsletterSignup(email) {
    try {
      const emailToJeff = {
        from: process.env.EMAIL_FROM || 'Jeff Honforloco Photography <noreply@jeffhonforlocophotos.com>',
        to: process.env.ADMIN_EMAIL || 'jeff@jeffhonforlocophotos.com',
        subject: 'New Newsletter Signup',
        html: this.generateNewsletterSignupHtml(email)
      };

      const welcomeEmail = {
        from: process.env.EMAIL_FROM || 'Jeff Honforloco Photography <noreply@jeffhonforlocophotos.com>',
        to: email,
        subject: 'Welcome to Jeff Honforloco Photography!',
        html: this.generateWelcomeEmailHtml()
      };

      // Send notification to Jeff
      const jeffEmailResult = await this.transporter.sendMail(emailToJeff);
      console.log('✅ Newsletter signup notification sent:', jeffEmailResult.messageId);

      // Send welcome email to subscriber
      const welcomeResult = await this.transporter.sendMail(welcomeEmail);
      console.log('✅ Welcome email sent:', welcomeResult.messageId);

      return {
        success: true,
        message: 'Newsletter signup processed successfully',
        data: {
          jeffEmailId: jeffEmailResult.messageId,
          welcomeEmailId: welcomeResult.messageId
        }
      };

    } catch (error) {
      console.error('❌ Send newsletter signup error:', error);
      return {
        success: false,
        message: 'Failed to process newsletter signup',
        error: error.message
      };
    }
  }

  generateContactEmailHtml(contactData) {
    const { full_name, email, phone, message, service_type, budget_range, event_date, location } = contactData;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Contact Inquiry</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #666; }
          .value { margin-top: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Inquiry</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${full_name}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value"><a href="mailto:${email}">${email}</a></div>
            </div>
            ${phone ? `
            <div class="field">
              <div class="label">Phone:</div>
              <div class="value">${phone}</div>
            </div>
            ` : ''}
            ${service_type ? `
            <div class="field">
              <div class="label">Service Type:</div>
              <div class="value">${service_type}</div>
            </div>
            ` : ''}
            ${budget_range ? `
            <div class="field">
              <div class="label">Budget Range:</div>
              <div class="value">${budget_range}</div>
            </div>
            ` : ''}
            ${event_date ? `
            <div class="field">
              <div class="label">Event Date:</div>
              <div class="value">${event_date}</div>
            </div>
            ` : ''}
            ${location ? `
            <div class="field">
              <div class="label">Location:</div>
              <div class="value">${location}</div>
            </div>
            ` : ''}
            <div class="field">
              <div class="label">Message:</div>
              <div class="value">${message.replace(/\n/g, '<br>')}</div>
            </div>
          </div>
          <div class="footer">
            <p>This inquiry was received through your photography website.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateConfirmationEmailHtml(fullName) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Thank you for your inquiry!</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You, ${fullName}!</h1>
          </div>
          <div class="content">
            <p>Thank you for reaching out to Jeff Honforloco Photography! I've received your inquiry and will get back to you within 24 hours.</p>
            <p>In the meantime, feel free to:</p>
            <ul>
              <li>Browse my portfolio at <a href="https://jeffhonforlocophotos.com/portfolios">jeffhonforlocophotos.com/portfolios</a></li>
              <li>Check out my latest work on social media</li>
              <li>Download my free prep guide for your upcoming session</li>
            </ul>
            <p>I look forward to working with you!</p>
            <p>Best regards,<br>Jeff Honforloco</p>
          </div>
          <div class="footer">
            <p>Jeff Honforloco Photography | Professional Photography Services</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateNewsletterSignupHtml(email) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Newsletter Signup</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Newsletter Signup</h1>
          </div>
          <div class="content">
            <p>A new subscriber has joined your newsletter!</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="footer">
            <p>This notification was sent from your photography website.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateWelcomeEmailHtml() {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to Jeff Honforloco Photography!</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .cta { text-align: center; margin: 20px 0; }
          .cta a { background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Jeff Honforloco Photography!</h1>
          </div>
          <div class="content">
            <p>Thank you for subscribing to my newsletter! I'm excited to share my latest work, photography tips, and exclusive offers with you.</p>
            <p>As a welcome gift, here's your free photography prep guide to help you get the most out of your next session:</p>
            <div class="cta">
              <a href="https://jeffhonforlocophotos.com/prep-guide">Download Free Prep Guide</a>
            </div>
            <p>You'll receive:</p>
            <ul>
              <li>Behind-the-scenes content from my latest shoots</li>
              <li>Photography tips and techniques</li>
              <li>Exclusive booking offers and discounts</li>
              <li>First access to new portfolio additions</li>
            </ul>
            <p>Thank you for being part of my photography community!</p>
            <p>Best regards,<br>Jeff Honforloco</p>
          </div>
          <div class="footer">
            <p>Jeff Honforloco Photography | Professional Photography Services</p>
            <p><a href="https://jeffhonforlocophotos.com">jeffhonforlocophotos.com</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export default new EmailService();
