import { Link } from 'react-router-dom';
import Layout from '../Layout';

interface BeautyPortfolioProps {
  images: Array<{ src: string; alt: string; caption: string }>;
}

const BeautyPortfolio = ({ images }: BeautyPortfolioProps) => {
  return (
    <Layout>
      <div className="min-h-screen bg-black pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Back to Portfolios Link */}
          <div className="mb-8">
            <Link 
              to="/portfolio" 
              className="inline-flex items-center text-photo-red hover:text-white transition-colors duration-300 text-lg"
            >
              <span className="mr-2">←</span>
              Back to Portfolios
            </Link>
          </div>

          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-wide">
              BEAUTY
            </h1>
          </div>

          {/* Image Grid - Varied sizes like Lindsay Adler's actual layout */}
          <div className="grid grid-cols-2 md:grid-cols-8 gap-3 md:gap-4 auto-rows-max">
            {images.map((image, index) => {
              // Create more varied column spans based on Lindsay Adler's actual layout
              const getColumnSpan = (index: number) => {
                const patterns = [
                  'md:col-span-2', 'md:col-span-2', 'md:col-span-2', 'md:col-span-2', // First row: 4 equal narrow columns
                  'md:col-span-3', 'md:col-span-2', 'md:col-span-3', // Second row: mixed sizes
                  'md:col-span-2', 'md:col-span-3', 'md:col-span-3', // Third row: mixed
                  'md:col-span-4', 'md:col-span-4', // Fourth row: 2 wide columns
                  'md:col-span-2', 'md:col-span-2', 'md:col-span-2', 'md:col-span-2', // Fifth row: back to 4 equal
                ];
                return patterns[index % patterns.length] || 'md:col-span-2';
              };
              
              // Add varying heights for more organic feel
              const getRowSpan = (index: number) => {
                const heightPatterns = ['', 'md:row-span-1', '', 'md:row-span-1', '', ''];
                return heightPatterns[index % heightPatterns.length] || '';
              };
              
              return (
                <div key={index} className={`relative group overflow-hidden cursor-pointer ${getColumnSpan(index)} ${getRowSpan(index)}`}>
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                </div>
              );
            })}
          </div>

          {/* Copyright Notice */}
          <div className="text-center mt-16 pt-8">
            <p className="text-white/60 text-sm tracking-wide">
              © 2025 Jeff Honforloco Photography. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BeautyPortfolio;