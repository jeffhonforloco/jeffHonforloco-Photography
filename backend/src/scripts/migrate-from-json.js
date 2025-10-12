import { getDatabase } from '../database/init.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Improved migration script that uses JSON data files
class JSONDataMigrator {
  constructor() {
    this.db = getDatabase();
  }

  async migrateAllData() {
    console.log('🚀 Starting comprehensive data migration...');
    
    try {
      // Migrate blog posts from JSON
      await this.migrateBlogPostsFromJSON();
      
      // Migrate portfolio images from extracted JSON
      await this.migratePortfolioFromJSON();
      
      // Migrate email templates
      await this.migrateEmailTemplates();
      
      // Create sample contacts
      await this.createSampleContacts();
      
      // Create analytics data
      await this.createAnalyticsData();
      
      // Create email sequences
      await this.createEmailSequences();
      
      console.log('✅ Comprehensive data migration completed!');
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }

  async migrateBlogPostsFromJSON() {
    console.log('📝 Migrating blog posts from JSON...');
    
    try {
      const blogDataPath = path.join(__dirname, '../../../public/data/blog-posts.json');
      const blogData = JSON.parse(fs.readFileSync(blogDataPath, 'utf8'));
      
      for (const post of blogData.posts) {
        // Check if post already exists
        const existing = this.db.prepare('SELECT id FROM blog_posts WHERE slug = ?').get(post.slug);
        if (existing) {
          console.log(`⏭️ Blog post "${post.slug}" already exists, skipping...`);
          continue;
        }
        
        const stmt = this.db.prepare(`
          INSERT INTO blog_posts (
            title, slug, content, excerpt, featured_image_url, 
            author_id, status, published_at, tags, metadata
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        const tags = post.category ? [post.category] : [];
        const metadata = {
          readTime: post.readTime,
          originalId: post.id,
          category: post.category
        };
        
        stmt.run(
          post.title,
          post.slug,
          post.content,
          post.excerpt,
          post.image,
          1, // Default author ID
          'published',
          new Date(post.date).toISOString(),
          JSON.stringify(tags),
          JSON.stringify(metadata)
        );
      }
      
      console.log(`✅ Migrated ${blogData.posts.length} blog posts`);
      
    } catch (error) {
      console.error('❌ Blog posts migration failed:', error);
    }
  }

  async migratePortfolioFromJSON() {
    console.log('🖼️ Migrating portfolio images from JSON...');
    
    try {
      // Try to read from extracted JSON first
      let portfolioData;
      const extractedPath = path.join(__dirname, '../data/portfolio-data.json');
      
      if (fs.existsSync(extractedPath)) {
        portfolioData = JSON.parse(fs.readFileSync(extractedPath, 'utf8'));
      } else {
        // Fallback to extracting from TypeScript file
        console.log('📄 Extracting portfolio data from TypeScript file...');
        const { default: PortfolioDataExtractor } = await import('./extract-portfolio-data.js');
        const extractor = new PortfolioDataExtractor();
        portfolioData = extractor.extractPortfolioData();
      }
      
      let totalImages = 0;
      
      for (const [category, images] of Object.entries(portfolioData)) {
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          
          // Check if image already exists
          const existing = this.db.prepare('SELECT id FROM portfolio_images WHERE image_url = ?').get(image.src);
          if (existing) {
            console.log(`⏭️ Portfolio image "${image.src}" already exists, skipping...`);
            continue;
          }
          
          const stmt = this.db.prepare(`
            INSERT INTO portfolio_images (
              title, description, image_url, thumbnail_url, category, 
              is_featured, sort_order, tags, metadata
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);
          
          const tags = [category];
          if (image.caption) {
            tags.push(...image.caption.toLowerCase().split(' ').filter(word => word.length > 2));
          }
          
          const metadata = {
            alt: image.alt,
            caption: image.caption,
            isVideo: image.isVideo || false,
            isYouTube: image.isYouTube || false,
            youTubeId: image.youTubeId || null,
            originalCategory: category
          };
          
          stmt.run(
            image.alt || `${category} image ${i + 1}`,
            image.caption || '',
            image.src,
            image.src, // Use same URL for thumbnail
            category,
            image.featured || false,
            i,
            JSON.stringify(tags),
            JSON.stringify(metadata)
          );
          
          totalImages++;
        }
      }
      
      console.log(`✅ Migrated ${totalImages} portfolio images`);
      
    } catch (error) {
      console.error('❌ Portfolio images migration failed:', error);
    }
  }

  async migrateEmailTemplates() {
    console.log('📧 Migrating email templates...');
    
    try {
      const templates = [
        {
          name: 'welcome',
          subject: 'Welcome to Jeff Honforloco Photography!',
          content: this.getWelcomeEmailTemplate()
        },
        {
          name: 'contact_confirmation',
          subject: 'Thank you for your inquiry!',
          content: this.getContactConfirmationTemplate()
        },
        {
          name: 'newsletter_signup',
          subject: 'Welcome to our photography community!',
          content: this.getNewsletterSignupTemplate()
        },
        {
          name: 'behind_scenes',
          subject: 'Behind the Scenes: The Art of Photography',
          content: this.getBehindScenesTemplate()
        },
        {
          name: 'booking_offer',
          subject: 'Special Photography Session Offer',
          content: this.getBookingOfferTemplate()
        },
        {
          name: 'follow_up_1',
          subject: 'Your Photography Session - What to Expect',
          content: this.getFollowUp1Template()
        },
        {
          name: 'follow_up_2',
          subject: 'Behind the Scenes: Creating Your Perfect Shot',
          content: this.getFollowUp2Template()
        },
        {
          name: 'follow_up_3',
          subject: 'Exclusive Photography Session Offer',
          content: this.getFollowUp3Template()
        }
      ];
      
      for (const template of templates) {
        // Check if template already exists
        const existing = this.db.prepare('SELECT id FROM email_templates WHERE name = ?').get(template.name);
        if (existing) {
          console.log(`⏭️ Email template "${template.name}" already exists, skipping...`);
          continue;
        }
        
        const stmt = this.db.prepare(`
          INSERT INTO email_templates (name, subject, content, is_active)
          VALUES (?, ?, ?, ?)
        `);
        
        stmt.run(template.name, template.subject, template.content, true);
      }
      
      console.log(`✅ Migrated ${templates.length} email templates`);
      
    } catch (error) {
      console.error('❌ Email templates migration failed:', error);
    }
  }

  async createSampleContacts() {
    console.log('👥 Creating sample contacts...');
    
    try {
      const sampleContacts = [
        {
          full_name: 'Sarah Johnson',
          email: 'sarah.johnson@example.com',
          phone: '+1-555-0123',
          message: 'Interested in a beauty photography session for my modeling portfolio. I love your work and would love to collaborate.',
          service_type: 'beauty',
          budget_range: '$1500-$3000',
          event_date: '2024-06-15',
          location: 'New York, NY',
          status: 'new',
          notes: 'Referred by Instagram. Very interested in editorial beauty work.'
        },
        {
          full_name: 'Michael Chen',
          email: 'michael.chen@example.com',
          phone: '+1-555-0456',
          message: 'Looking for editorial photography for my fashion brand launch. Need high-quality images for marketing materials.',
          service_type: 'editorial',
          budget_range: '$3000-$5000',
          event_date: '2024-07-20',
          location: 'Los Angeles, CA',
          status: 'contacted',
          notes: 'Scheduled consultation call for next week. Very professional and clear about requirements.'
        },
        {
          full_name: 'Emma Rodriguez',
          email: 'emma.rodriguez@example.com',
          phone: '+1-555-0789',
          message: 'Need lifestyle photography for my personal brand and social media. Love your natural, authentic style.',
          service_type: 'lifestyle',
          budget_range: '$2000-$4000',
          event_date: '2024-08-10',
          location: 'Miami, FL',
          status: 'qualified',
          notes: 'Qualified lead. Budget confirmed, timeline flexible. Perfect fit for our lifestyle portfolio.'
        },
        {
          full_name: 'David Thompson',
          email: 'david.thompson@example.com',
          phone: '+1-555-0321',
          message: 'Interested in glamour photography for a special occasion. Anniversary celebration with my wife.',
          service_type: 'glamour',
          budget_range: '$2500-$3500',
          event_date: '2024-09-05',
          location: 'Chicago, IL',
          status: 'booked',
          notes: 'Session booked for September 5th. Deposit received. Very excited about the shoot.'
        },
        {
          full_name: 'Lisa Wang',
          email: 'lisa.wang@example.com',
          phone: '+1-555-0654',
          message: 'Looking for fashion photography for my clothing line. Need professional images for e-commerce and marketing.',
          service_type: 'fashion',
          budget_range: '$4000-$6000',
          event_date: '2024-10-15',
          location: 'San Francisco, CA',
          status: 'completed',
          notes: 'Session completed successfully. Client very happy with results. Potential for ongoing partnership.'
        },
        {
          full_name: 'James Wilson',
          email: 'james.wilson@example.com',
          phone: '+1-555-0987',
          message: 'Interested in motion photography for my music video. Love your cinematic style.',
          service_type: 'motion',
          budget_range: '$5000-$8000',
          event_date: '2024-11-20',
          location: 'Austin, TX',
          status: 'new',
          notes: 'Music industry contact. High budget project. Very creative vision.'
        }
      ];
      
      for (const contact of sampleContacts) {
        // Check if contact already exists
        const existing = this.db.prepare('SELECT id FROM contacts WHERE email = ?').get(contact.email);
        if (existing) {
          console.log(`⏭️ Contact "${contact.email}" already exists, skipping...`);
          continue;
        }
        
        const stmt = this.db.prepare(`
          INSERT INTO contacts (
            full_name, email, phone, message, service_type, 
            budget_range, event_date, location, status, notes
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run(
          contact.full_name,
          contact.email,
          contact.phone,
          contact.message,
          contact.service_type,
          contact.budget_range,
          contact.event_date,
          contact.location,
          contact.status,
          contact.notes
        );
      }
      
      console.log(`✅ Created ${sampleContacts.length} sample contacts`);
      
    } catch (error) {
      console.error('❌ Sample contacts creation failed:', error);
    }
  }

  async createAnalyticsData() {
    console.log('📊 Creating analytics data...');
    
    try {
      const events = [
        { type: 'page_view', data: { page: '/', referrer: 'google.com' }, user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        { type: 'page_view', data: { page: '/portfolios', referrer: 'facebook.com' }, user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15' },
        { type: 'page_view', data: { page: '/about', referrer: 'instagram.com' }, user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
        { type: 'contact_form', data: { service_type: 'beauty', location: 'New York' }, user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        { type: 'newsletter_signup', data: { source: 'homepage' }, user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15' },
        { type: 'portfolio_view', data: { category: 'fashion', image_id: 1 }, user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
        { type: 'blog_view', data: { post_slug: 'how-to-prepare-beauty-photography-session' }, user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        { type: 'contact_form', data: { service_type: 'editorial', location: 'Los Angeles' }, user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15' },
        { type: 'page_view', data: { page: '/contact', referrer: 'direct' }, user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
        { type: 'newsletter_signup', data: { source: 'blog' }, user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        { type: 'portfolio_view', data: { category: 'beauty', image_id: 5 }, user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15' },
        { type: 'blog_view', data: { post_slug: 'luxury-fashion-photography-trends-2025' }, user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
        { type: 'page_view', data: { page: '/portfolios/beauty', referrer: 'google.com' }, user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        { type: 'portfolio_view', data: { category: 'glamour', image_id: 3 }, user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15' },
        { type: 'contact_form', data: { service_type: 'lifestyle', location: 'Miami' }, user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' }
      ];
      
      for (const event of events) {
        const stmt = this.db.prepare(`
          INSERT INTO analytics (event_type, event_data, user_agent, ip_address, referrer)
          VALUES (?, ?, ?, ?, ?)
        `);
        
        stmt.run(
          event.type,
          JSON.stringify(event.data),
          event.user_agent,
          '192.168.1.100',
          event.data.referrer || 'direct'
        );
      }
      
      console.log(`✅ Created ${events.length} analytics events`);
      
    } catch (error) {
      console.error('❌ Analytics data creation failed:', error);
    }
  }

  async createEmailSequences() {
    console.log('📧 Creating email sequences...');
    
    try {
      // Get some contacts to create sequences for
      const contacts = this.db.prepare('SELECT id FROM contacts LIMIT 3').all();
      
      const sequences = [
        {
          contact_id: contacts[0]?.id,
          sequence_type: 'welcome',
          step_number: 1,
          email_template: 'welcome',
          scheduled_for: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
          status: 'pending'
        },
        {
          contact_id: contacts[0]?.id,
          sequence_type: 'welcome',
          step_number: 2,
          email_template: 'behind_scenes',
          scheduled_for: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
          status: 'pending'
        },
        {
          contact_id: contacts[1]?.id,
          sequence_type: 'follow_up',
          step_number: 1,
          email_template: 'follow_up_1',
          scheduled_for: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
          status: 'pending'
        }
      ];
      
      for (const sequence of sequences) {
        if (sequence.contact_id) {
          const stmt = this.db.prepare(`
            INSERT INTO email_sequences (
              contact_id, sequence_type, step_number, email_template, 
              scheduled_for, status
            ) VALUES (?, ?, ?, ?, ?, ?)
          `);
          
          stmt.run(
            sequence.contact_id,
            sequence.sequence_type,
            sequence.step_number,
            sequence.email_template,
            sequence.scheduled_for,
            sequence.status
          );
        }
      }
      
      console.log(`✅ Created ${sequences.length} email sequences`);
      
    } catch (error) {
      console.error('❌ Email sequences creation failed:', error);
    }
  }

  // Email template methods
  getWelcomeEmailTemplate() {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #000; text-align: center;">Welcome to Jeff Honforloco Photography!</h1>
        <p>Thank you for subscribing to our newsletter. You'll receive:</p>
        <ul>
          <li>Behind-the-scenes content from our latest shoots</li>
          <li>Photography tips and techniques</li>
          <li>Exclusive booking offers and discounts</li>
          <li>First access to new portfolio additions</li>
        </ul>
        <p>Best regards,<br>Jeff Honforloco</p>
      </div>
    `;
  }

  getContactConfirmationTemplate() {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #000;">Thank you for your inquiry!</h1>
        <p>I've received your message and will get back to you within 24 hours.</p>
        <p>In the meantime, feel free to browse my portfolio and check out my latest work.</p>
        <p>Best regards,<br>Jeff Honforloco</p>
      </div>
    `;
  }

  getNewsletterSignupTemplate() {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #000;">Welcome to our photography community!</h1>
        <p>Thank you for joining our newsletter. You'll receive exclusive content and updates.</p>
        <p>Best regards,<br>Jeff Honforloco</p>
      </div>
    `;
  }

  getBehindScenesTemplate() {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #000;">Behind the Scenes: The Art of Photography</h1>
        <p>Discover the creative process behind stunning photography.</p>
        <p>Best regards,<br>Jeff Honforloco</p>
      </div>
    `;
  }

  getBookingOfferTemplate() {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #000;">Special Photography Session Offer</h1>
        <p>Don't miss out on our limited-time photography session offer!</p>
        <p>Best regards,<br>Jeff Honforloco</p>
      </div>
    `;
  }

  getFollowUp1Template() {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #000;">Your Photography Session - What to Expect</h1>
        <p>Here's what you can expect during your upcoming photography session...</p>
        <p>Best regards,<br>Jeff Honforloco</p>
      </div>
    `;
  }

  getFollowUp2Template() {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #000;">Behind the Scenes: Creating Your Perfect Shot</h1>
        <p>Learn about the creative process behind creating stunning photographs...</p>
        <p>Best regards,<br>Jeff Honforloco</p>
      </div>
    `;
  }

  getFollowUp3Template() {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #000;">Exclusive Photography Session Offer</h1>
        <p>As a valued subscriber, here's an exclusive offer for your next photography session...</p>
        <p>Best regards,<br>Jeff Honforloco</p>
      </div>
    `;
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const migrator = new JSONDataMigrator();
  migrator.migrateAllData()
    .then(() => {
      console.log('🎉 Comprehensive migration completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

export default JSONDataMigrator;
