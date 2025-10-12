#!/usr/bin/env node

/**
 * Data Migration Runner
 * 
 * This script runs the comprehensive data migration to populate
 * the new backend with all existing data from the Supabase setup.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting Data Migration for Jeff Honforloco Photography Platform');
console.log('================================================================');

// Check if we're in the right directory
if (!fs.existsSync(path.join(__dirname, 'package.json'))) {
  console.error('❌ Error: Please run this script from the backend directory');
  process.exit(1);
}

// Check if database exists
const dbPath = path.join(__dirname, 'database/photography.db');
if (fs.existsSync(dbPath)) {
  console.log('📊 Database already exists. Migration will add new data...');
} else {
  console.log('📊 Database will be created during migration...');
}

try {
  console.log('\n🔄 Running comprehensive data migration...');
  console.log('This will migrate:');
  console.log('  • Blog posts from public/data/blog-posts.json');
  console.log('  • Portfolio images from src/data/portfolio-data.ts');
  console.log('  • Email templates');
  console.log('  • Sample contacts and analytics data');
  console.log('  • Email sequences');
  
  // Run the migration
  execSync('npm run migrate', { 
    stdio: 'inherit',
    cwd: __dirname 
  });
  
  console.log('\n✅ Migration completed successfully!');
  console.log('\n📊 Data Summary:');
  
  // Show data counts
  try {
    const { getDatabase } = await import('./src/database/init.js');
    const db = getDatabase();
    
    const blogCount = db.prepare('SELECT COUNT(*) as count FROM blog_posts').get().count;
    const portfolioCount = db.prepare('SELECT COUNT(*) as count FROM portfolio_images').get().count;
    const contactCount = db.prepare('SELECT COUNT(*) as count FROM contacts').get().count;
    const templateCount = db.prepare('SELECT COUNT(*) as count FROM email_templates').get().count;
    const analyticsCount = db.prepare('SELECT COUNT(*) as count FROM analytics').get().count;
    
    console.log(`  • Blog Posts: ${blogCount}`);
    console.log(`  • Portfolio Images: ${portfolioCount}`);
    console.log(`  • Contacts: ${contactCount}`);
    console.log(`  • Email Templates: ${templateCount}`);
    console.log(`  • Analytics Events: ${analyticsCount}`);
    
  } catch (error) {
    console.log('  • Unable to get data counts (database may not be accessible)');
  }
  
  console.log('\n🎉 Your photography platform is now ready!');
  console.log('\nNext steps:');
  console.log('1. Start the backend server: npm run dev');
  console.log('2. Configure your email service in .env');
  console.log('3. Test the frontend integration');
  console.log('4. Login to admin panel to manage content');
  
} catch (error) {
  console.error('\n❌ Migration failed:', error.message);
  console.log('\nTroubleshooting:');
  console.log('1. Make sure you\'re in the backend directory');
  console.log('2. Run: npm install');
  console.log('3. Check file permissions');
  console.log('4. Try: npm run migrate:basic');
  process.exit(1);
}
