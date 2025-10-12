// Image optimization configuration for different use cases

export interface ImageConfig {
  quality: number;
  format: 'webp' | 'jpeg' | 'png' | 'auto';
  width?: number;
  height?: number;
  fit: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  blur?: number;
  sharpen?: number;
  sizes: string;
}

// Predefined configurations for different image types
export const IMAGE_CONFIGS: Record<string, ImageConfig> = {
  // Hero images - high quality, large size
  hero: {
    quality: 85,
    format: 'webp',
    width: 1920,
    height: 1080,
    fit: 'cover',
    blur: 0,
    sharpen: 0,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw'
  },
  
  // Portfolio images - optimized for galleries
  portfolio: {
    quality: 80,
    format: 'webp',
    width: 1200,
    height: 800,
    fit: 'cover',
    blur: 0,
    sharpen: 1,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
  },
  
  // Thumbnail images - small, fast loading
  thumbnail: {
    quality: 70,
    format: 'webp',
    width: 300,
    height: 200,
    fit: 'cover',
    blur: 0,
    sharpen: 0,
    sizes: '(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw'
  },
  
  // Avatar images - square, medium quality
  avatar: {
    quality: 75,
    format: 'webp',
    width: 150,
    height: 150,
    fit: 'cover',
    blur: 0,
    sharpen: 0,
    sizes: '150px'
  },
  
  // Gallery images - medium quality, responsive
  gallery: {
    quality: 80,
    format: 'webp',
    width: 800,
    height: 600,
    fit: 'cover',
    blur: 0,
    sharpen: 0,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw'
  },
  
  // Blog images - optimized for content
  blog: {
    quality: 75,
    format: 'webp',
    width: 800,
    height: 600,
    fit: 'cover',
    blur: 0,
    sharpen: 0,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw'
  },
  
  // Background images - lower quality, large size
  background: {
    quality: 60,
    format: 'webp',
    width: 1920,
    height: 1080,
    fit: 'cover',
    blur: 0,
    sharpen: 0,
    sizes: '100vw'
  },
  
  // Card images - medium quality, square
  card: {
    quality: 75,
    format: 'webp',
    width: 400,
    height: 400,
    fit: 'cover',
    blur: 0,
    sharpen: 0,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
  }
};

// Breakpoints for responsive images
export const BREAKPOINTS = {
  mobile: 320,
  tablet: 640,
  laptop: 1024,
  desktop: 1280,
  wide: 1536,
  ultra: 1920
} as const;

// Generate responsive srcSet
export const generateResponsiveSrcSet = (
  baseSrc: string,
  config: ImageConfig,
  customBreakpoints?: number[]
): string => {
  const breakpoints = customBreakpoints || [
    BREAKPOINTS.mobile,
    BREAKPOINTS.tablet,
    BREAKPOINTS.laptop,
    BREAKPOINTS.desktop,
    BREAKPOINTS.wide,
    BREAKPOINTS.ultra
  ];
  
  return breakpoints
    .map(size => {
      const optimizedUrl = generateOptimizedUrl(baseSrc, {
        ...config,
        width: size
      });
      return `${optimizedUrl} ${size}w`;
    })
    .join(', ');
};

// Generate optimized URL
export const generateOptimizedUrl = (
  originalSrc: string,
  config: ImageConfig
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

// Get configuration for specific use case
export const getImageConfig = (useCase: string): ImageConfig => {
  return IMAGE_CONFIGS[useCase] || IMAGE_CONFIGS.portfolio;
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

// Preload critical images
export const preloadCriticalImages = (images: string[]): void => {
  images.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

// Check if image is in viewport
export const isInViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// Lazy load images with intersection observer
export const setupLazyLoading = (
  images: NodeListOf<HTMLImageElement>,
  options: IntersectionObserverInit = {}
): void => {
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '50px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      }
    });
  }, { ...defaultOptions, ...options });
  
  images.forEach(img => observer.observe(img));
};

// Performance monitoring
export const monitorImagePerformance = (): void => {
  const images = document.querySelectorAll('img');
  const startTimes = new Map<string, number>();
  
  images.forEach(img => {
    const src = img.src;
    startTimes.set(src, performance.now());
    
    img.addEventListener('load', () => {
      const loadTime = performance.now() - (startTimes.get(src) || 0);
      console.log(`Image loaded: ${src} in ${loadTime.toFixed(2)}ms`);
    });
    
    img.addEventListener('error', () => {
      console.error(`Image failed to load: ${src}`);
    });
  });
};

// Export default configurations
export default {
  IMAGE_CONFIGS,
  BREAKPOINTS,
  generateResponsiveSrcSet,
  generateOptimizedUrl,
  getImageConfig,
  generateBlurPlaceholder,
  preloadCriticalImages,
  isInViewport,
  setupLazyLoading,
  monitorImagePerformance
};
