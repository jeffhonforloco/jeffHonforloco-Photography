import { useEffect, useRef, useState } from 'react';

interface HeroSliderProps {
  images: string[];
}

const HeroSlider = ({ images }: HeroSliderProps) => {
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationId: number;
    let currentPosition = 0;
    const speed = 0.5; // pixels per frame
    const totalHeight = container.scrollHeight / 2; // Half because we duplicate images

    const animate = () => {
      if (direction === 'up') {
        currentPosition += speed;
        if (currentPosition >= totalHeight) {
          setDirection('down');
        }
      } else {
        currentPosition -= speed;
        if (currentPosition <= 0) {
          setDirection('up');
        }
      }

      container.style.transform = `translateY(-${currentPosition}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [direction]);

  // Triple the images for seamless loop
  const tripleImages = [...images, ...images, ...images];

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div 
        ref={containerRef}
        className="flex flex-col"
        style={{ willChange: 'transform' }}
      >
        {tripleImages.map((image, index) => (
          <div key={`slider-${index}`} className="h-screen flex-shrink-0 relative">
            <img 
              src={image} 
              alt={`Jeff Honforloco Portfolio ${index + 1} - Fashion Beauty Photography`} 
              className="w-full h-full object-cover" 
              loading={index < 3 ? "eager" : "lazy"}
              decoding="async"
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;