
const HeroSection = () => {
  const portfolioImages = [
    '/lovable-uploads/86a54898-0663-4d33-9cc9-a793f168d0ab.png',
    '/lovable-uploads/47c04841-2b95-4229-8bea-7e1c4925bafb.png',
    '/lovable-uploads/1a35b5b2-6090-4718-9833-79a270346b20.png',
    '/lovable-uploads/91b16668-debd-4e7b-9fab-e6200abfaa53.png',
    '/lovable-uploads/2688f2e4-7158-4784-bdc4-2d84ff3a124d.png',
    '/lovable-uploads/e302a6bd-9a35-4c62-924e-5f14e4e2d241.png',
    '/lovable-uploads/cc3dde2a-3f8c-4c40-b4b7-33cc0fd118e0.png',
    '/lovable-uploads/09ac1697-3757-47bf-84fa-5d922e1f1779.png',
    '/lovable-uploads/3ffed44f-cebf-4d6d-ba06-86e21b470903.png',
    '/lovable-uploads/37f4ae80-0bd4-4eae-8c84-a252aa263a64.png'
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      {/* Masonry-style Grid matching reference image */}
      <div className="absolute inset-0 p-2 md:p-3">
        {/* Mobile: 2 columns */}
        <div className="md:hidden grid grid-cols-2 gap-3 h-full">
          {/* Column 1 - Mobile */}
          <div className="flex flex-col gap-3 animate-slide-up-continuous">
            {portfolioImages.filter((_, index) => index % 2 === 0).map((image, index) => (
              <div key={`mobile-col1-${index}`} className="relative group overflow-hidden flex-shrink-0">
                <img src={image} alt={`Portfolio ${index + 1}`} className="w-full h-auto object-cover transition-all duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500"></div>
              </div>
            ))}
          </div>
          
          {/* Column 2 - Mobile */}
          <div className="flex flex-col gap-3 animate-slide-up-continuous" style={{ animationDelay: '-15s' }}>
            {portfolioImages.filter((_, index) => index % 2 === 1).map((image, index) => (
              <div key={`mobile-col2-${index}`} className="relative group overflow-hidden flex-shrink-0">
                <img src={image} alt={`Portfolio ${index + 1}`} className="w-full h-auto object-cover transition-all duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: 3 columns */}
        <div className="hidden md:grid grid-cols-3 gap-4 h-full">
          {/* Column 1 - Desktop */}
          <div className="flex flex-col gap-4 animate-slide-up-continuous">
            {portfolioImages.filter((_, index) => index % 3 === 0).map((image, index) => (
              <div key={`desktop-col1-${index}`} className="relative group overflow-hidden flex-shrink-0">
                <img src={image} alt={`Portfolio ${index + 1}`} className="w-full h-auto object-cover transition-all duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500"></div>
              </div>
            ))}
          </div>
          
          {/* Column 2 - Desktop */}
          <div className="flex flex-col gap-4 animate-slide-up-continuous" style={{ animationDelay: '-20s' }}>
            {portfolioImages.filter((_, index) => index % 3 === 1).map((image, index) => (
              <div key={`desktop-col2-${index}`} className="relative group overflow-hidden flex-shrink-0">
                <img src={image} alt={`Portfolio ${index + 1}`} className="w-full h-auto object-cover transition-all duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-500"></div>
              </div>
            ))}
          </div>
          
          {/* Column 3 - Desktop */}
          <div className="flex flex-col gap-4 animate-slide-up-continuous" style={{ animationDelay: '-10s' }}>
            {portfolioImages.filter((_, index) => index % 3 === 2).map((image, index) => (
              <div key={`desktop-col3-${index}`} className="relative group overflow-hidden flex-shrink-0">
                <img src={image} alt={`Portfolio ${index + 1}`} className="w-full h-auto object-cover transition-all duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Logo - Centered overlay */}
      <div className="md:hidden absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <img 
          src="/lovable-uploads/ff1ac4ba-08e6-4647-8c5c-5e76943f6cfa.png" 
          alt="J Logo" 
          className="w-72 sm:w-80 filter drop-shadow-2xl brightness-150 contrast-125"
        />
      </div>

      {/* Desktop Logo - Static centered overlay */}
      <div className="hidden md:flex absolute inset-0 items-center justify-center z-20 pointer-events-none">
        <img 
          src="/lovable-uploads/ff1ac4ba-08e6-4647-8c5c-5e76943f6cfa.png" 
          alt="J Logo" 
          className="w-[30rem] lg:w-[36rem] xl:w-[42rem] 2xl:w-[48rem] filter drop-shadow-2xl brightness-150 contrast-125"
        />
      </div>

    </section>
  );
};

export default HeroSection;
