import React, { useState, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import LazyImage from './LazyImage';
import { ChevronLeft, ChevronRight, X, ZoomIn, Download } from 'lucide-react';

interface ImageGalleryProps {
  images: Array<{
    id: string;
    src: string;
    alt: string;
    title?: string;
    description?: string;
    width?: number;
    height?: number;
    priority?: boolean;
  }>;
  className?: string;
  showThumbnails?: boolean;
  showControls?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  aspectRatio?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
  onImageClick?: (index: number) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  className,
  showThumbnails = true,
  showControls = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  aspectRatio = '16/9',
  objectFit = 'cover',
  onImageClick
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);

  // Auto-play functionality
  React.useEffect(() => {
    if (!isAutoPlaying || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, images.length, autoPlayInterval]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToImage = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying(!isAutoPlaying);
  }, [isAutoPlaying]);

  const currentImage = images[currentIndex];

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;

      switch (e.key) {
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case 'Escape':
          setIsFullscreen(false);
          break;
        case ' ':
          e.preventDefault();
          toggleAutoPlay();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, goToPrevious, goToNext, toggleAutoPlay]);

  // Preload next and previous images
  const preloadImages = useMemo(() => {
    const preloadIndexes = [
      (currentIndex - 1 + images.length) % images.length,
      (currentIndex + 1) % images.length
    ];
    
    return preloadIndexes.map(index => images[index]);
  }, [currentIndex, images]);

  if (!images.length) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {/* Main Image Display */}
      <div className="relative group">
        <LazyImage
          key={currentImage.id}
          src={currentImage.src}
          alt={currentImage.alt}
          width={currentImage.width}
          height={currentImage.height}
          priority={currentIndex === 0}
          aspectRatio={aspectRatio}
          objectFit={objectFit}
          className="w-full cursor-pointer transition-transform duration-300 hover:scale-105"
          onLoad={() => {
            // Preload adjacent images
            preloadImages.forEach(img => {
              const link = document.createElement('link');
              link.rel = 'preload';
              link.as = 'image';
              link.href = img.src;
              document.head.appendChild(link);
            });
          }}
          onClick={() => {
            setIsFullscreen(true);
            onImageClick?.(currentIndex);
          }}
        />

        {/* Image Info Overlay */}
        {(currentImage.title || currentImage.description) && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
            {currentImage.title && (
              <h3 className="font-semibold text-lg mb-1">{currentImage.title}</h3>
            )}
            {currentImage.description && (
              <p className="text-sm opacity-90">{currentImage.description}</p>
            )}
          </div>
        )}

        {/* Controls Overlay */}
        {showControls && images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={goToPrevious}
              className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Zoom Button */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="View fullscreen"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
      </div>

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => goToImage(index)}
              className={cn(
                'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200',
                index === currentIndex
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <LazyImage
                src={image.src}
                alt={image.alt}
                width={80}
                height={80}
                objectFit="cover"
                className="w-full h-full"
                placeholder="skeleton"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            aria-label="Close fullscreen"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="relative w-full h-full flex items-center justify-center p-8">
            <LazyImage
              src={currentImage.src}
              alt={currentImage.alt}
              width={currentImage.width}
              height={currentImage.height}
              priority
              objectFit="contain"
              className="max-w-full max-h-full"
            />

            {/* Fullscreen Controls */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Auto-play Toggle */}
            <button
              onClick={toggleAutoPlay}
              className={cn(
                'absolute bottom-8 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full text-white transition-colors duration-200',
                isAutoPlaying ? 'bg-blue-600 hover:bg-blue-700' : 'bg-black/50 hover:bg-black/70'
              )}
            >
              {isAutoPlaying ? 'Pause' : 'Play'}
            </button>

            {/* Download Button */}
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = currentImage.src;
                link.download = currentImage.alt;
                link.click();
              }}
              className="absolute bottom-8 right-8 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
              aria-label="Download image"
            >
              <Download className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
