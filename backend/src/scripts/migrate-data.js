import { getDatabase } from '../database/init.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data migration script to populate the new backend with existing data
class DataMigrator {
  constructor() {
    this.db = getDatabase();
  }

  async migrateAllData() {
    console.log('🚀 Starting data migration...');
    
    try {
      // Migrate blog posts
      await this.migrateBlogPosts();
      
      // Migrate portfolio images
      await this.migratePortfolioImages();
      
      // Migrate email templates
      await this.migrateEmailTemplates();
      
      // Create sample contacts
      await this.createSampleContacts();
      
      // Create analytics data
      await this.createAnalyticsData();
      
      console.log('✅ Data migration completed successfully!');
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }

  async migrateBlogPosts() {
    console.log('📝 Migrating blog posts...');
    
    try {
      // Read blog posts from JSON file
      const blogDataPath = path.join(__dirname, '../../../public/data/blog-posts.json');
      const blogData = JSON.parse(fs.readFileSync(blogDataPath, 'utf8'));
      
      for (const post of blogData.posts) {
        const stmt = this.db.prepare(`
          INSERT INTO blog_posts (
            title, slug, content, excerpt, featured_image_url, 
            author_id, status, published_at, tags, metadata
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        const tags = post.category ? [post.category] : [];
        const metadata = {
          readTime: post.readTime,
          originalId: post.id
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

  async migratePortfolioImages() {
    console.log('🖼️ Migrating portfolio images...');
    
    try {
      // Read portfolio data from TypeScript file
      const portfolioDataPath = path.join(__dirname, '../../../src/data/portfolio-data.ts');
      const portfolioContent = fs.readFileSync(portfolioDataPath, 'utf8');
      
      // Extract portfolio data using regex (simple approach)
      const categories = ['beauty', 'fashion', 'glamour', 'editorial', 'lifestyle', 'motion'];
      let totalImages = 0;
      
      for (const category of categories) {
        const categoryData = this.extractCategoryData(portfolioContent, category);
        
        for (let i = 0; i < categoryData.length; i++) {
          const image = categoryData[i];
          
          const stmt = this.db.prepare(`
            INSERT INTO portfolio_images (
              title, description, image_url, thumbnail_url, category, 
              is_featured, sort_order, tags, metadata
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);
          
          const tags = [category];
          if (image.caption) {
            tags.push(...image.caption.toLowerCase().split(' '));
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

  extractCategoryData(content, category) {
    // Simple regex extraction - in production, you'd want a more robust parser
    const categoryRegex = new RegExp(`${category}:\\s*\\[([\\s\\S]*?)\\]`, 'g');
    const match = categoryRegex.exec(content);
    
    if (!match) return [];
    
    const categoryContent = match[1];
    const imageRegex = /{\s*src:\s*['"`]([^'"`]+)['"`],\s*alt:\s*['"`]([^'"`]*)['"`],\s*caption:\s*['"`]([^'"`]*)['"`](?:,\s*([^}]+))?}/g;
    const images = [];
    let imageMatch;
    
    while ((imageMatch = imageRegex.exec(categoryContent)) !== null) {
      const image = {
        src: imageMatch[1],
        alt: imageMatch[2],
        caption: imageMatch[3]
      };
      
      // Parse additional properties if they exist
      if (imageMatch[4]) {
        const additionalProps = imageMatch[4];
        if (additionalProps.includes('isVideo: true')) image.isVideo = true;
        if (additionalProps.includes('featured: true')) image.featured = true;
        if (additionalProps.includes('isYouTube: true')) image.isYouTube = true;
        
        const youtubeMatch = additionalProps.match(/youTubeId:\s*['"`]([^'"`]+)['"`]/);
        if (youtubeMatch) image.youTubeId = youtubeMatch[1];
      }
      
      images.push(image);
    }
    
    return images;
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
        }
      ];
      
      for (const template of templates) {
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
          message: 'Interested in a beauty photography session for my modeling portfolio.',
          service_type: 'beauty',
          budget_range: '$1500-$3000',
          event_date: '2024-06-15',
          location: 'New York, NY',
          status: 'new'
        },
        {
          full_name: 'Michael Chen',
          email: 'michael.chen@example.com',
          phone: '+1-555-0456',
          message: 'Looking for editorial photography for my fashion brand launch.',
          service_type: 'editorial',
          budget_range: '$3000-$5000',
          event_date: '2024-07-20',
          location: 'Los Angeles, CA',
          status: 'contacted'
        },
        {
          full_name: 'Emma Rodriguez',
          email: 'emma.rodriguez@example.com',
          phone: '+1-555-0789',
          message: 'Need lifestyle photography for my personal brand and social media.',
          service_type: 'lifestyle',
          budget_range: '$2000-$4000',
          event_date: '2024-08-10',
          location: 'Miami, FL',
          status: 'qualified'
        },
        {
          full_name: 'David Thompson',
          email: 'david.thompson@example.com',
          phone: '+1-555-0321',
          message: 'Interested in glamour photography for a special occasion.',
          service_type: 'glamour',
          budget_range: '$2500-$3500',
          event_date: '2024-09-05',
          location: 'Chicago, IL',
          status: 'booked'
        },
        {
          full_name: 'Lisa Wang',
          email: 'lisa.wang@example.com',
          phone: '+1-555-0654',
          message: 'Looking for fashion photography for my clothing line.',
          service_type: 'fashion',
          budget_range: '$4000-$6000',
          event_date: '2024-10-15',
          location: 'San Francisco, CA',
          status: 'completed'
        }
      ];
      
      for (const contact of sampleContacts) {
        const stmt = this.db.prepare(`
          INSERT INTO contacts (
            full_name, email, phone, message, service_type, 
            budget_range, event_date, location, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
          contact.status
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
        { type: 'page_view', data: { page: '/', referrer: 'google.com' } },
        { type: 'page_view', data: { page: '/portfolios', referrer: 'facebook.com' } },
        { type: 'page_view', data: { page: '/about', referrer: 'instagram.com' } },
        { type: 'contact_form', data: { service_type: 'beauty', location: 'New York' } },
        { type: 'newsletter_signup', data: { source: 'homepage' } },
        { type: 'portfolio_view', data: { category: 'fashion', image_id: 1 } },
        { type: 'blog_view', data: { post_slug: 'how-to-prepare-beauty-photography-session' } },
        { type: 'contact_form', data: { service_type: 'editorial', location: 'Los Angeles' } },
        { type: 'page_view', data: { page: '/contact', referrer: 'direct' } },
        { type: 'newsletter_signup', data: { source: 'blog' } }
      ];
      
      for (const event of events) {
        const stmt = this.db.prepare(`
          INSERT INTO analytics (event_type, event_data, user_agent, ip_address, referrer)
          VALUES (?, ?, ?, ?, ?)
        `);
        
        stmt.run(
          event.type,
          JSON.stringify(event.data),
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          '192.168.1.100',
          event.data.referrer || 'direct'
        );
      }
      
      console.log(`✅ Created ${events.length} analytics events`);
      
    } catch (error) {
      console.error('❌ Analytics data creation failed:', error);
    }
  }

  // Email template methods
  getWelcomeEmailTemplate() {
    return `
      <h1>Welcome to Jeff Honforloco Photography!</h1>
      <p>Thank you for subscribing to our newsletter. You'll receive:</p>
      <ul>
        <li>Behind-the-scenes content from our latest shoots</li>
        <li>Photography tips and techniques</li>
        <li>Exclusive booking offers and discounts</li>
        <li>First access to new portfolio additions</li>
      </ul>
      <p>Best regards,<br>Jeff Honforloco</p>
    `;
  }

  getContactConfirmationTemplate() {
    return `
      <h1>Thank you for your inquiry!</h1>
      <p>I've received your message and will get back to you within 24 hours.</p>
      <p>In the meantime, feel free to browse my portfolio and check out my latest work.</p>
      <p>Best regards,<br>Jeff Honforloco</p>
    `;
  }

  getNewsletterSignupTemplate() {
    return `
      <h1>Welcome to our photography community!</h1>
      <p>Thank you for joining our newsletter. You'll receive exclusive content and updates.</p>
      <p>Best regards,<br>Jeff Honforloco</p>
    `;
  }

  getBehindScenesTemplate() {
    return `
      <h1>Behind the Scenes: The Art of Photography</h1>
      <p>Discover the creative process behind stunning photography.</p>
      <p>Best regards,<br>Jeff Honforloco</p>
    `;
  }

  getBookingOfferTemplate() {
    return `
      <h1>Special Photography Session Offer</h1>
      <p>Don't miss out on our limited-time photography session offer!</p>
      <p>Best regards,<br>Jeff Honforloco</p>
    `;
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const migrator = new DataMigrator();
  migrator.migrateAllData()
    .then(() => {
      console.log('🎉 Migration completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

export default DataMigrator;
