
import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  className?: string;
}

const ImageGallery = ({ images, className = "" }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  };

  return (
    <>
      <div className={`portfolio-grid ${className}`}>
        {images.map((image, index) => (
          <div
            key={index}
            className="portfolio-item animate-scale-in"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => openLightbox(index)}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover image-hover-effect"
              loading="lazy"
            />
            <div className="image-overlay opacity-0 group-hover:opacity-100">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border border-white rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center"
          onKeyDown={handleKeyPress}
          tabIndex={0}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-8 right-8 text-white hover:text-photo-red z-20 transition-colors duration-300"
          >
            <X size={32} />
          </button>
          
          {/* Navigation buttons */}
          <button
            onClick={prevImage}
            className="absolute left-8 top-1/2 -translate-y-1/2 text-white hover:text-photo-red z-20 transition-colors duration-300"
          >
            <ChevronLeft size={48} />
          </button>
          
          <button
            onClick={nextImage}
            className="absolute right-8 top-1/2 -translate-y-1/2 text-white hover:text-photo-red z-20 transition-colors duration-300"
          >
            <ChevronRight size={48} />
          </button>

          {/* Image container */}
          <div className="w-full h-full flex items-center justify-center p-16">
            <img
              src={images[selectedImage].src}
              alt={images[selectedImage].alt}
              className="max-w-full max-h-full object-contain animate-scale-in"
            />
          </div>

          {/* Caption */}
          {images[selectedImage].caption && (
            <div className="absolute bottom-8 left-8 right-8 text-center">
              <p className="text-white font-light text-lg tracking-wide max-w-2xl mx-auto">
                {images[selectedImage].caption}
              </p>
            </div>
          )}

          {/* Image counter */}
          <div className="absolute top-8 left-8 text-white font-light tracking-wider">
            <span className="text-photo-red">{selectedImage + 1}</span> / {images.length}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
