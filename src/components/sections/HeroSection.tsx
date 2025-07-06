
const HeroSection = () => {
  const portfolioImages = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=95',
    'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=95',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=95',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=95',
    'https://images.unsplash.com/photo-1506629905963-b3b17f54e5b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=95',
    'https://images.unsplash.com/photo-1518577915332-c2a19f149a75?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=95',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=95',
    'https://images.unsplash.com/photo-1512646605205-78422b7c7896?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=95',
    'https://images.unsplash.com/photo-1539571696520-9f2891b92ac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=95'
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      {/* Responsive Image Grid */}
      <div className="absolute inset-0 p-3 md:p-4 lg:p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 h-full">
          {portfolioImages.map((image, index) => (
            <div 
              key={index} 
              className={`relative group overflow-hidden rounded-2xl lg:rounded-3xl ${
                index % 7 === 0 || index % 7 === 3 ? 'row-span-2' : ''
              } ${index % 11 === 0 ? 'col-span-2 md:col-span-1' : ''}`}
            >
              <img
                src={image}
                alt={`Portfolio ${index + 1}`}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 brightness-90 group-hover:brightness-100"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.backgroundColor = '#000';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-all duration-700"></div>
              <div className="absolute inset-0 ring-1 ring-white/5 rounded-2xl lg:rounded-3xl"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10"></div>

      {/* Central Logo */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="text-center animate-fade-in px-4">
          <div className="relative">
            <img 
              src="/lovable-uploads/ff1ac4ba-08e6-4647-8c5c-5e76943f6cfa.png" 
              alt="J Logo" 
              className="w-48 sm:w-60 md:w-80 lg:w-96 xl:w-[28rem] 2xl:w-[32rem] mx-auto filter drop-shadow-2xl brightness-105 hover:brightness-110 transition-all duration-700 hover:scale-105"
              style={{ imageRendering: 'crisp-edges' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent rounded-full blur-2xl"></div>
            <div className="absolute -inset-4 bg-gradient-to-r from-photo-red/20 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse-subtle"></div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-4 md:left-20 w-16 md:w-32 h-16 md:h-32 bg-gradient-to-br from-photo-red/20 to-purple-400/20 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-32 right-4 md:right-32 w-12 md:w-24 h-12 md:h-24 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-xl animate-float" style={{ animationDelay: '-2s' }}></div>
      <div className="absolute top-1/2 left-2 md:left-10 w-8 md:w-16 h-8 md:h-16 bg-gradient-to-br from-yellow-400/20 to-red-400/20 rounded-full blur-xl animate-float" style={{ animationDelay: '-4s' }}></div>
    </section>
  );
};

export default HeroSection;
