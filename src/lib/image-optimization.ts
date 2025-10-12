// Image optimization utilities and services

export interface ImageOptimizationConfig {
  quality: number;
  format: 'webp' | 'jpeg' | 'png' | 'auto';
  width?: number;
  height?: number;
  fit: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  blur?: number;
  sharpen?: number;
}

export interface OptimizedImageData {
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

// Default optimization configurations for different use cases
export const IMAGE_CONFIGS = {
  hero: {
    quality: 85,
    format: 'webp' as const,
    width: 1920,
    height: 1080,
    fit: 'cover' as const,
    blur: 0,
    sharpen: 0
  },
  portfolio: {
    quality: 80,
    format: 'webp' as const,
    width: 1200,
    height: 800,
    fit: 'cover' as const,
    blur: 0,
    sharpen: 1
  },
  thumbnail: {
    quality: 70,
    format: 'webp' as const,
    width: 300,
    height: 200,
    fit: 'cover' as const,
    blur: 0,
    sharpen: 0
  },
  avatar: {
    quality: 75,
    format: 'webp' as const,
    width: 150,
    height: 150,
    fit: 'cover' as const,
    blur: 0,
    sharpen: 0
  },
  gallery: {
    quality: 80,
    format: 'webp' as const,
    width: 800,
    height: 600,
    fit: 'cover' as const,
    blur: 0,
    sharpen: 0
  }
} as const;

// Generate optimized image URL
export const generateOptimizedUrl = (
  originalSrc: string,
  config: ImageOptimizationConfig
): string => {
  // If it's already an optimized URL or external, return as is
  if (originalSrc.includes('?') || originalSrc.startsWith('http')) {
    return originalSrc;
  }

  // For local images, implement optimization service
  const params = new URLSearchParams();
  
  if (config.width) params.set('w', config.width.toString());
  if (config.height) params.set('h', config.height.toString());
  params.set('q', config.quality.toString());
  params.set('f', config.format);
  params.set('fit', config.fit);
  if (config.blur && config.blur > 0) params.set('blur', config.blur.toString());
  if (config.sharpen && config.sharpen > 0) params.set('sharpen', config.sharpen.toString());
  params.set('auto', 'format'); // Auto format selection
  
  return `${originalSrc}?${params.toString()}`;
};

// Generate responsive srcSet
export const generateSrcSet = (
  originalSrc: string,
  config: ImageOptimizationConfig,
  breakpoints: number[] = [320, 640, 768, 1024, 1280, 1536, 1920]
): string => {
  return breakpoints
    .map(size => {
      const optimizedUrl = generateOptimizedUrl(originalSrc, {
        ...config,
        width: size
      });
      return `${optimizedUrl} ${size}w`;
    })
    .join(', ');
};

// Generate sizes attribute
export const generateSizes = (customSizes?: string): string => {
  if (customSizes) return customSizes;
  
  return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw';
};

// Generate blur placeholder
export const generateBlurPlaceholder = (
  width: number = 10,
  height: number = 10,
  color: string = '#f3f4f6'
): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // Create a subtle gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.5, adjustColor(color, -10));
    gradient.addColorStop(1, adjustColor(color, -20));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
  
  return canvas.toDataURL('image/jpeg', 0.1);
};

// Adjust color brightness
const adjustColor = (color: string, amount: number): string => {
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// Get image dimensions
export const getImageDimensions = (src: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
};

// Preload image
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to preload image'));
    img.crossOrigin = 'anonymous';
    img.src = src;
  });
};

// Preload multiple images
export const preloadImages = async (
  images: string[],
  options: {
    batchSize?: number;
    delay?: number;
    onProgress?: (loaded: number, total: number) => void;
  } = {}
): Promise<void> => {
  const { batchSize = 5, delay = 100, onProgress } = options;
  
  let loaded = 0;
  
  for (let i = 0; i < images.length; i += batchSize) {
    const batch = images.slice(i, i + batchSize);
    
    try {
      await Promise.allSettled(batch.map(preloadImage));
      loaded += batch.length;
      onProgress?.(loaded, images.length);
      
      if (i + batchSize < images.length) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (error) {
      console.warn('Batch preload failed:', error);
    }
  }
};

// Check if WebP is supported
export const isWebPSupported = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

// Get optimal image format
export const getOptimalFormat = async (): Promise<'webp' | 'jpeg' | 'png'> => {
  const webpSupported = await isWebPSupported();
  return webpSupported ? 'webp' : 'jpeg';
};

// Generate optimized image data
export const generateOptimizedImageData = async (
  src: string,
  config: ImageOptimizationConfig,
  customSizes?: string
): Promise<OptimizedImageData> => {
  // Get original image dimensions
  const dimensions = await getImageDimensions(src);
  const aspectRatio = dimensions.width / dimensions.height;

  // Generate optimized URLs
  const optimizedSrc = generateOptimizedUrl(src, config);
  const srcSet = generateSrcSet(src, config);
  const webpSrc = generateOptimizedUrl(src, { ...config, format: 'webp' });
  const webpSrcSet = generateSrcSet(src, { ...config, format: 'webp' });
  const sizes = generateSizes(customSizes);
  const placeholder = generateBlurPlaceholder(10, Math.round(10 / aspectRatio));

  return {
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
  };
};

// Image optimization service integration
export class ImageOptimizationService {
  private cache = new Map<string, OptimizedImageData>();
  
  async optimizeImage(
    src: string,
    config: ImageOptimizationConfig,
    customSizes?: string
  ): Promise<OptimizedImageData> {
    const cacheKey = `${src}-${JSON.stringify(config)}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }
    
    const optimizedData = await generateOptimizedImageData(src, config, customSizes);
    this.cache.set(cacheKey, optimizedData);
    
    return optimizedData;
  }
  
  clearCache(): void {
    this.cache.clear();
  }
  
  getCacheSize(): number {
    return this.cache.size;
  }
}

// Export singleton instance
export const imageOptimizationService = new ImageOptimizationService();
