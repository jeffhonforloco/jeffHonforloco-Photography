import { portfolioImages } from '../data/hero-images';

export const useHeroImages = () => {
  // Duplicate images to create seamless loop
  const duplicatedImages = [...portfolioImages, ...portfolioImages];
  
  // Distribute across 3 columns (10 each for desktop)
  const col1Images = duplicatedImages.filter((_, index) => index % 3 === 0);
  const col2Images = duplicatedImages.filter((_, index) => index % 3 === 1);
  const col3Images = duplicatedImages.filter((_, index) => index % 3 === 2);

  return {
    portfolioImages,
    col1Images,
    col2Images,
    col3Images
  };
};