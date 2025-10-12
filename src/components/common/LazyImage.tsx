import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  placeholder?: 'blur' | 'empty' | 'skeleton';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  style?: React.CSSProperties;
  aspectRatio?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 75,
  sizes = '100vw',
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError,
  style,
  aspectRatio,
  objectFit = 'cover',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Generate optimized image URL with WebP support
  const generateOptimizedSrc = useCallback((originalSrc: string, width?: number, quality: number = 75) => {
    // If it's already an optimized URL or external, return as is
    if (originalSrc.includes('?') || originalSrc.startsWith('http')) {
      return originalSrc;
    }

    // For local images, implement optimization
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    params.set('q', quality.toString());
    params.set('f', 'webp');
    params.set('auto', 'format'); // Auto format selection
    
    return `${originalSrc}?${params.toString()}`;
  }, []);

  // Generate responsive srcSet
  const generateSrcSet = useCallback((originalSrc: string, quality: number = 75) => {
    const breakpoints = [320, 640, 768, 1024, 1280, 1536, 1920, 2560];
    return breakpoints
      .map(size => `${generateOptimizedSrc(originalSrc, size, quality)} ${size}w`)
      .join(', ');
  }, [generateOptimizedSrc]);

  // Generate blur placeholder
  const generateBlurDataURL = useCallback((width: number = 10, height: number = 10) => {
    if (blurDataURL) return blurDataURL;
    
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create a subtle gradient blur
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#f8fafc');
      gradient.addColorStop(0.5, '#f1f5f9');
      gradient.addColorStop(1, '#e2e8f0');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }
    
    return canvas.toDataURL('image/jpeg', 0.1);
  }, [blurDataURL]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setIsLoading(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px', // Start loading 100px before image comes into view
        threshold: 0.01
      }
    );

    observerRef.current = observer;

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [priority, isInView]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  }, [onError]);

  const optimizedSrc = generateOptimizedSrc(src, width, quality);
  const srcSet = generateSrcSet(src, quality);
  const defaultBlurDataURL = generateBlurDataURL(10, 10);

  return (
    <div
      ref={imgRef}
      className={cn(
        'relative overflow-hidden',
        aspectRatio && `aspect-[${aspectRatio}]`,
        className
      )}
      style={{
        width: width,
        height: height,
        aspectRatio: aspectRatio,
        ...style
      }}
    >
      {/* Placeholder */}
      {!isLoaded && !hasError && (
        <>
          {placeholder === 'blur' && (
            <div
              className="absolute inset-0 bg-gray-100"
              style={{
                backgroundImage: `url(${defaultBlurDataURL})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(20px)',
                transform: 'scale(1.1)'
              }}
            />
          )}
          {placeholder === 'skeleton' && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          {placeholder === 'empty' && (
            <div className="absolute inset-0 bg-gray-100" />
          )}
        </>
      )}

      {/* Loading spinner */}
      {isLoading && !isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
        </div>
      )}

      {/* Main image */}
      {isInView && (
        <picture>
          {/* WebP source for modern browsers */}
          <source
            srcSet={srcSet}
            sizes={sizes}
            type="image/webp"
          />
          {/* Fallback image */}
          <img
            src={optimizedSrc}
            srcSet={srcSet}
            sizes={sizes}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              'transition-all duration-500 ease-out',
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105',
              'w-full h-full'
            )}
            style={{
              objectFit,
              width: '100%',
              height: '100%'
            }}
            {...props}
          />
        </picture>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center text-gray-500 p-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm font-medium">Image failed to load</p>
            <p className="text-xs text-gray-400 mt-1">Please try refreshing the page</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;