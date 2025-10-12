import { useState, useEffect, useCallback } from 'react';

interface ImageOptimizationOptions {
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'auto';
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  blur?: number;
  sharpen?: number;
}

interface OptimizedImageData {
  src: string;
  srcSet: string;
  sizes: string;
  webpSrc: string;
  webpSrcSet: string;
  placeholder: string;
  dimensions: {
    width: number;
    height: number;
    aspectRatio: number;
  };
}

interface UseImageOptimizationReturn {
  optimizedData: OptimizedImageData | null;
  isLoading: boolean;
  error: string | null;
  preloadImage: (src: string) => Promise<void>;
  generateBlurPlaceholder: (width: number, height: number) => string;
}

const useImageOptimization = (
  src: string,
  options: ImageOptimizationOptions = {}
): UseImageOptimizationReturn => {
  const [optimizedData, setOptimizedData] = useState<OptimizedImageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    quality = 75,
    format = 'auto',
    width,
    height,
    fit = 'cover',
    blur = 0,
    sharpen = 0
  } = options;

  // Generate optimized image URL
  const generateOptimizedUrl = useCallback((
    originalSrc: string,
    targetWidth?: number,
    targetHeight?: number,
    targetQuality: number = quality,
    targetFormat: string = format
  ) => {
    // If it's already an optimized URL or external, return as is
    if (originalSrc.includes('?') || originalSrc.startsWith('http')) {
      return originalSrc;
    }

    // For local images, implement optimization service
    const params = new URLSearchParams();
    
    if (targetWidth) params.set('w', targetWidth.toString());
    if (targetHeight) params.set('h', targetHeight.toString());
    params.set('q', targetQuality.toString());
    params.set('f', targetFormat);
    params.set('fit', fit);
    if (blur > 0) params.set('blur', blur.toString());
    if (sharpen > 0) params.set('sharpen', sharpen.toString());
    params.set('auto', 'format'); // Auto format selection
    
    return `${originalSrc}?${params.toString()}`;
  }, [quality, format, fit, blur, sharpen]);

  // Generate responsive srcSet
  const generateSrcSet = useCallback((
    originalSrc: string,
    targetQuality: number = quality,
    targetFormat: string = format
  ) => {
    const breakpoints = [320, 640, 768, 1024, 1280, 1536, 1920, 2560];
    return breakpoints
      .map(size => `${generateOptimizedUrl(originalSrc, size, undefined, targetQuality, targetFormat)} ${size}w`)
      .join(', ');
  }, [generateOptimizedUrl, quality, format]);

  // Generate sizes attribute
  const generateSizes = useCallback((customSizes?: string) => {
    if (customSizes) return customSizes;
    
    return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw';
  }, []);

  // Generate blur placeholder
  const generateBlurPlaceholder = useCallback((width: number, height: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create a subtle gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#f8fafc');
      gradient.addColorStop(0.5, '#f1f5f9');
      gradient.addColorStop(1, '#e2e8f0');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }
    
    return canvas.toDataURL('image/jpeg', 0.1);
  }, []);

  // Preload image
  const preloadImage = useCallback(async (imageSrc: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageSrc;
    });
  }, []);

  // Get image dimensions
  const getImageDimensions = useCallback(async (imageSrc: string) => {
    return new Promise<{ width: number; height: number }>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageSrc;
    });
  }, []);

  // Optimize image data
  useEffect(() => {
    const optimizeImage = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get original image dimensions
        const dimensions = await getImageDimensions(src);
        const aspectRatio = dimensions.width / dimensions.height;

        // Generate optimized URLs
        const optimizedSrc = generateOptimizedUrl(src, width, height);
        const srcSet = generateSrcSet(src);
        const webpSrc = generateOptimizedUrl(src, width, height, quality, 'webp');
        const webpSrcSet = generateSrcSet(src, quality, 'webp');
        const sizes = generateSizes();
        const placeholder = generateBlurPlaceholder(10, Math.round(10 / aspectRatio));

        setOptimizedData({
          src: optimizedSrc,
          srcSet,
          sizes,
          webpSrc,
          webpSrcSet,
          placeholder,
          dimensions: {
            width: dimensions.width,
            height: dimensions.height,
            aspectRatio
          }
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to optimize image');
      } finally {
        setIsLoading(false);
      }
    };

    if (src) {
      optimizeImage();
    }
  }, [src, width, height, quality, format, generateOptimizedUrl, generateSrcSet, generateSizes, generateBlurPlaceholder, getImageDimensions]);

  return {
    optimizedData,
    isLoading,
    error,
    preloadImage,
    generateBlurPlaceholder
  };
};

export default useImageOptimization;
