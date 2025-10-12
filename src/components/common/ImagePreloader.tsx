import React, { useEffect, useState, useCallback } from 'react';

interface ImagePreloaderProps {
  images: string[];
  onProgress?: (loaded: number, total: number) => void;
  onComplete?: () => void;
  onError?: (error: string) => void;
  priority?: string[];
  batchSize?: number;
  delay?: number;
}

interface PreloadStatus {
  loaded: number;
  total: number;
  errors: string[];
  isComplete: boolean;
  progress: number;
}

const ImagePreloader: React.FC<ImagePreloaderProps> = ({
  images,
  onProgress,
  onComplete,
  onError,
  priority = [],
  batchSize = 5,
  delay = 100
}) => {
  const [status, setStatus] = useState<PreloadStatus>({
    loaded: 0,
    total: images.length,
    errors: [],
    isComplete: false,
    progress: 0
  });

  const preloadImage = useCallback((src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        resolve();
      };
      
      img.onerror = () => {
        reject(new Error(`Failed to load image: ${src}`));
      };
      
      // Set crossOrigin for CORS images
      img.crossOrigin = 'anonymous';
      img.src = src;
    });
  }, []);

  const preloadBatch = useCallback(async (imageBatch: string[]): Promise<void> => {
    const promises = imageBatch.map(src => 
      preloadImage(src).catch(error => {
        console.warn('Image preload failed:', error.message);
        return error.message;
      })
    );

    const results = await Promise.allSettled(promises);
    
    const errors = results
      .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
      .map(result => result.reason);

    return Promise.resolve();
  }, [preloadImage]);

  const preloadImages = useCallback(async () => {
    if (images.length === 0) {
      setStatus(prev => ({ ...prev, isComplete: true, progress: 100 }));
      onComplete?.();
      return;
    }

    // Sort images by priority
    const sortedImages = [...images].sort((a, b) => {
      const aIndex = priority.indexOf(a);
      const bIndex = priority.indexOf(b);
      
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });

    let loaded = 0;
    const errors: string[] = [];

    // Process images in batches
    for (let i = 0; i < sortedImages.length; i += batchSize) {
      const batch = sortedImages.slice(i, i + batchSize);
      
      try {
        await preloadBatch(batch);
        loaded += batch.length;
        
        const progress = Math.round((loaded / images.length) * 100);
        
        setStatus({
          loaded,
          total: images.length,
          errors,
          isComplete: false,
          progress
        });
        
        onProgress?.(loaded, images.length);
        
        // Add delay between batches to prevent overwhelming the browser
        if (i + batchSize < sortedImages.length) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(errorMessage);
        onError?.(errorMessage);
      }
    }

    setStatus(prev => ({
      ...prev,
      isComplete: true,
      progress: 100
    }));
    
    onComplete?.();
  }, [images, priority, batchSize, delay, preloadBatch, onProgress, onComplete, onError]);

  useEffect(() => {
    preloadImages();
  }, [preloadImages]);

  return null; // This component doesn't render anything
};

// Hook for using image preloader
export const useImagePreloader = (images: string[], options?: {
  priority?: string[];
  batchSize?: number;
  delay?: number;
}) => {
  const [status, setStatus] = useState<PreloadStatus>({
    loaded: 0,
    total: images.length,
    errors: [],
    isComplete: false,
    progress: 0
  });

  const preloadImages = useCallback(async () => {
    if (images.length === 0) return;

    const { priority = [], batchSize = 5, delay = 100 } = options || {};
    
    // Sort images by priority
    const sortedImages = [...images].sort((a, b) => {
      const aIndex = priority.indexOf(a);
      const bIndex = priority.indexOf(b);
      
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });

    let loaded = 0;
    const errors: string[] = [];

    // Process images in batches
    for (let i = 0; i < sortedImages.length; i += batchSize) {
      const batch = sortedImages.slice(i, i + batchSize);
      
      try {
        const promises = batch.map(src => 
          new Promise<void>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => reject(new Error(`Failed to load: ${src}`));
            img.crossOrigin = 'anonymous';
            img.src = src;
          })
        );

        await Promise.allSettled(promises);
        loaded += batch.length;
        
        const progress = Math.round((loaded / images.length) * 100);
        
        setStatus({
          loaded,
          total: images.length,
          errors,
          isComplete: false,
          progress
        });
        
        // Add delay between batches
        if (i + batchSize < sortedImages.length) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (error) {
        console.warn('Batch preload failed:', error);
      }
    }

    setStatus(prev => ({
      ...prev,
      isComplete: true,
      progress: 100
    }));
  }, [images, options]);

  useEffect(() => {
    preloadImages();
  }, [preloadImages]);

  return status;
};

export default ImagePreloader;
