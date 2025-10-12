// Image optimization utilities - works behind the scenes

export const generateOptimizedUrl = (src: string, width?: number, quality: number = 75): string => {
  if (src.includes('?') || src.startsWith('http')) {
    return src;
  }

  const params = new URLSearchParams();
  if (width) params.set('w', width.toString());
  params.set('q', quality.toString());
  params.set('f', 'webp');
  params.set('auto', 'format');
  
  return `${src}?${params.toString()}`;
};

export const generateSrcSet = (src: string, quality: number = 75): string => {
  const breakpoints = [320, 640, 768, 1024, 1280, 1536, 1920];
  return breakpoints
    .map(size => `${generateOptimizedUrl(src, size, quality)} ${size}w`)
    .join(', ');
};

export const generateSizes = (): string => {
  return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
};

export const preloadCriticalImages = (images: string[]): void => {
  images.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

export const isWebPSupported = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};
