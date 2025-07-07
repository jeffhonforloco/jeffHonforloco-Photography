import { portfolioImages } from '../data/hero-images';

export const useHeroImages = () => {
  // Distribute all images across columns for better variety
  const col1Images = [...portfolioImages.slice(0, Math.ceil(portfolioImages.length / 3))];
  const col2Images = [...portfolioImages.slice(Math.ceil(portfolioImages.length / 3), Math.ceil(portfolioImages.length * 2 / 3))];
  const col3Images = [...portfolioImages.slice(Math.ceil(portfolioImages.length * 2 / 3))];

  return {
    portfolioImages,
    col1Images,
    col2Images,
    col3Images
  };
};