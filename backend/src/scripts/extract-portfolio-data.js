import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Extract portfolio data from the TypeScript file and convert to JSON
class PortfolioDataExtractor {
  constructor() {
    this.portfolioDataPath = path.join(__dirname, '../../../src/data/portfolio-data.ts');
  }

  extractPortfolioData() {
    console.log('🖼️ Extracting portfolio data...');
    
    try {
      const content = fs.readFileSync(this.portfolioDataPath, 'utf8');
      const portfolioData = {};
      
      const categories = ['beauty', 'fashion', 'glamour', 'editorial', 'lifestyle', 'motion'];
      
      for (const category of categories) {
        portfolioData[category] = this.extractCategoryImages(content, category);
      }
      
      // Save extracted data to JSON file
      const outputPath = path.join(__dirname, '../../../backend/data/portfolio-data.json');
      const outputDir = path.dirname(outputPath);
      
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      fs.writeFileSync(outputPath, JSON.stringify(portfolioData, null, 2));
      console.log(`✅ Portfolio data extracted to ${outputPath}`);
      
      return portfolioData;
      
    } catch (error) {
      console.error('❌ Portfolio data extraction failed:', error);
      throw error;
    }
  }

  extractCategoryImages(content, category) {
    const categoryRegex = new RegExp(`${category}:\\s*\\[([\\s\\S]*?)\\]`, 'g');
    const match = categoryRegex.exec(content);
    
    if (!match) return [];
    
    const categoryContent = match[1];
    const images = [];
    
    // More robust regex to handle various image object formats
    const imageRegex = /{\s*src:\s*['"`]([^'"`]+)['"`],\s*alt:\s*['"`]([^'"`]*)['"`],\s*caption:\s*['"`]([^'"`]*)['"`](?:,\s*([^}]+))?}/g;
    let imageMatch;
    
    while ((imageMatch = imageRegex.exec(categoryContent)) !== null) {
      const image = {
        src: imageMatch[1],
        alt: imageMatch[2],
        caption: imageMatch[3]
      };
      
      // Parse additional properties
      if (imageMatch[4]) {
        const additionalProps = imageMatch[4];
        
        // Check for boolean properties
        if (additionalProps.includes('isVideo: true')) image.isVideo = true;
        if (additionalProps.includes('featured: true')) image.featured = true;
        if (additionalProps.includes('isYouTube: true')) image.isYouTube = true;
        
        // Extract youTubeId
        const youtubeMatch = additionalProps.match(/youTubeId:\s*['"`]([^'"`]+)['"`]/);
        if (youtubeMatch) image.youTubeId = youtubeMatch[1];
      }
      
      images.push(image);
    }
    
    return images;
  }
}

// Run extraction if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const extractor = new PortfolioDataExtractor();
  extractor.extractPortfolioData()
    .then(() => {
      console.log('🎉 Portfolio data extraction completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Extraction failed:', error);
      process.exit(1);
    });
}

export default PortfolioDataExtractor;
