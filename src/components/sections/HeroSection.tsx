
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const HeroSection = () => {
  const [contentData, setContentData] = useState<any>(null);

  useEffect(() => {
    fetch('/data/jeff-content.json')
      .then(response => response.json())
      .then(data => setContentData(data))
      .catch(error => console.error('Error loading content:', error));
  }, []);

  if (!contentData) {
    return <div className="min-h-screen bg-photo-black"></div>;
  }

  const portfolioImages = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  ];

  return (
    <section className="relative min-h-screen bg-photo-black overflow-hidden">
      {/* Image Grid Background */}
      <div className="absolute inset-0">
        <div className="grid grid-cols-12 grid-rows-8 h-full gap-1">
          {/* Top Row - 3 images */}
          <div className="col-span-4 row-span-3 relative overflow-hidden">
            <img
              src={portfolioImages[0]}
              alt="Fashion Portrait"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="col-span-4 row-span-4 relative overflow-hidden">
            <img
              src={portfolioImages[1]}
              alt="Beauty Portrait"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="col-span-4 row-span-3 relative overflow-hidden">
            <img
              src={portfolioImages[2]}
              alt="Editorial Portrait"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Middle Section - Space for name */}
          <div className="col-span-4 row-span-2"></div>
          <div className="col-span-4 row-span-1"></div>
          <div className="col-span-4 row-span-2"></div>

          {/* Bottom Row - 3 images */}
          <div className="col-span-4 row-span-3 relative overflow-hidden">
            <img
              src={portfolioImages[3]}
              alt="Glamour Portrait"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="col-span-4 row-span-3 relative overflow-hidden">
            <img
              src={portfolioImages[4]}
              alt="Lifestyle Portrait"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="col-span-4 row-span-3 relative overflow-hidden">
            <img
              src={portfolioImages[5]}
              alt="Fashion Portrait"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Centered Name and Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center max-w-4xl mx-auto px-8">
          <h1 className="font-playfair text-8xl md:text-9xl lg:text-[12rem] font-light tracking-[0.02em] text-white mb-8 leading-[0.8] drop-shadow-2xl">
            JEFF
          </h1>
          <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.25em] text-white/95 mb-12 drop-shadow-lg">
            HONFORLOCO
          </h2>
          
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-photo-red to-transparent mx-auto mb-12"></div>
          
          <p className="font-light text-xl md:text-2xl text-white/90 tracking-wide leading-relaxed max-w-3xl mx-auto mb-8 drop-shadow-md">
            {contentData.personal.profession}
          </p>
          
          <blockquote className="font-playfair text-lg md:text-xl text-white/80 italic tracking-wide leading-relaxed max-w-2xl mx-auto mb-16 drop-shadow-md">
            "{contentData.personal.quote}"
          </blockquote>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <Link 
              to="/portfolio" 
              className="group relative bg-photo-red hover:bg-photo-red-hover text-white px-12 py-4 font-medium tracking-[0.2em] uppercase text-sm transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-photo-red/40 overflow-hidden"
            >
              <span className="relative z-10">View Portfolio</span>
              <div className="absolute inset-0 bg-gradient-to-r from-photo-red-hover to-photo-red opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </Link>
            <Link 
              to="/contact" 
              className="group border-2 border-white/80 text-white hover:bg-white hover:text-photo-black px-12 py-4 font-medium tracking-[0.2em] uppercase text-sm transition-all duration-700 hover:scale-105 backdrop-blur-sm"
            >
              Book Session
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
