
import { HeroImageGrid, HeroContent, HeroSEO } from './hero';
import { useHeroImages } from '@/hooks/useHeroImages';

const HeroSection = () => {
  const { col1Images, col2Images, col3Images } = useHeroImages();

  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      <HeroSEO />
      
      <HeroImageGrid 
        col1Images={col1Images}
        col2Images={col2Images}
        col3Images={col3Images}
      />

      <HeroContent />
    </section>
  );
};

export default HeroSection;
