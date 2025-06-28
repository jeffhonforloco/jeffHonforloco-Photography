
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

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70"></div>
      </div>
      
      <div className="relative z-10 text-center max-w-6xl mx-auto px-8">
        <div className="mb-12">
          <h1 className="font-playfair text-8xl md:text-9xl lg:text-[10rem] font-extralight tracking-[0.02em] text-white mb-8 leading-[0.8] drop-shadow-2xl">
            JEFF
          </h1>
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-extralight tracking-[0.25em] text-white/95 mb-16 drop-shadow-lg">
            HONFORLOCO
          </h2>
        </div>
        
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-photo-red to-transparent mx-auto mb-16"></div>
        
        <p className="font-light text-xl md:text-2xl text-white/85 tracking-wide leading-relaxed max-w-4xl mx-auto mb-8 drop-shadow-md">
          {contentData.personal.profession}
        </p>
        
        <blockquote className="font-playfair text-lg md:text-xl text-white/75 italic tracking-wide leading-relaxed max-w-3xl mx-auto mb-20 drop-shadow-md">
          "{contentData.personal.quote}"
        </blockquote>
        
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
          <Link 
            to="/portfolio" 
            className="group relative bg-photo-red hover:bg-photo-red-hover text-white px-16 py-6 font-medium tracking-[0.2em] uppercase text-sm transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-photo-red/40 overflow-hidden"
          >
            <span className="relative z-10">View Portfolio</span>
            <div className="absolute inset-0 bg-gradient-to-r from-photo-red-hover to-photo-red opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          </Link>
          <Link 
            to="/contact" 
            className="group border-2 border-white/80 text-white hover:bg-white hover:text-photo-black px-16 py-6 font-medium tracking-[0.2em] uppercase text-sm transition-all duration-700 hover:scale-105 backdrop-blur-sm"
          >
            Book Session
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
