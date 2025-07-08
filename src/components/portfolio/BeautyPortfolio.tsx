interface BeautyPortfolioProps {
  images: Array<{ src: string; alt: string; caption: string }>;
}

const BeautyPortfolio = ({ images }: BeautyPortfolioProps) => {
  return (
    <div className="min-h-screen bg-black pt-20 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back to Portfolios Link */}
        <div className="mb-8">
          <a 
            href="/portfolio" 
            className="inline-flex items-center text-photo-red hover:text-photo-red-hover font-medium text-sm transition-colors duration-300"
          >
            ← Back to Portfolios
          </a>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-wider">
            BEAUTY
          </h1>
        </div>

        {/* Image Grid - Responsive grid that grows with content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
          {images.map((image, index) => (
            <div key={index} className="aspect-[3/4] overflow-hidden">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BeautyPortfolio;