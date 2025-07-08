import { portfolioImages } from '../data/hero-images';

export const useHeroImages = () => {
  // Use fewer duplicates for better performance - 2x instead of 2x
  const duplicatedImages = [...portfolioImages, ...portfolioImages.slice(0, 20)];
  
  // Distribute images across columns more efficiently
  const col1Images = duplicatedImages.slice(0, Math.ceil(duplicatedImages.length / 3));
  const col2Images = duplicatedImages.slice(Math.ceil(duplicatedImages.length / 3), Math.ceil(duplicatedImages.length * 2 / 3));
  const col3Images = duplicatedImages.slice(Math.ceil(duplicatedImages.length * 2 / 3));

  return {
    portfolioImages,
    col1Images,
    col2Images,
    col3Images
  };
};