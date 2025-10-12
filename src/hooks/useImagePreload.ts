import { useEffect, useCallback } from 'react';

interface PreloadOptions {
  priority?: string[];
  batchSize?: number;
  delay?: number;
}

export const useImagePreload = (images: string[], options: PreloadOptions = {}) => {
  const { priority = [], batchSize = 3, delay = 100 } = options;

  const preloadImage = useCallback((src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load: ${src}`));
      img.crossOrigin = 'anonymous';
      img.src = src;
    });
  }, []);

  useEffect(() => {
    if (images.length === 0) return;

    const preloadImages = async () => {
      // Sort by priority
      const sortedImages = [...images].sort((a, b) => {
        const aIndex = priority.indexOf(a);
        const bIndex = priority.indexOf(b);
        if (aIndex === -1 && bIndex === -1) return 0;
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });

      // Preload in batches
      for (let i = 0; i < sortedImages.length; i += batchSize) {
        const batch = sortedImages.slice(i, i + batchSize);
        try {
          await Promise.allSettled(batch.map(preloadImage));
          if (i + batchSize < sortedImages.length) {
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        } catch (error) {
          // Silently handle errors
        }
      }
    };

    preloadImages();
  }, [images, priority, batchSize, delay, preloadImage]);
};
