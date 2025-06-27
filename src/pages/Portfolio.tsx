
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const Portfolio = () => {
  const portfolioCategories = [
    {
      title: 'Beauty',
      description: 'Elegant beauty photography showcasing natural and enhanced aesthetics with sophisticated lighting and composition',
      image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      href: '/portfolio/beauty',
      count: '24 Images'
    },
    {
      title: 'Fashion',
      description: 'Contemporary fashion photography with bold styling, creative concepts, and innovative visual narratives',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      href: '/portfolio/fashion',
      count: '31 Images'
    },
    {
      title: 'Editorial',
      description: 'Storytelling through sophisticated editorial and commercial work with artistic vision and technical excellence',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      href: '/portfolio/editorial',
      count: '18 Images'
    },
    {
      title: 'Glamour',
      description: 'Sophisticated glamour photography with dramatic lighting, elegant styling, and captivating visual appeal',
      image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      href: '/portfolio/glamour',
      count: '22 Images'
    },
    {
      title: 'Lifestyle',
      description: 'Authentic lifestyle moments captured with artistic vision, showcasing real people in beautiful settings',
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      href: '/portfolio/lifestyle',
      count: '27 Images'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="luxury-spacing section-padding pt-32">
        <div className="text-center mb-24 animate-fade-in-up">
          <h1 className="editorial-title">Portfolio</h1>
          <p className="editorial-text max-w-4xl mx-auto">
            A comprehensive collection of work spanning beauty, fashion, editorial, 
            glamour, and lifestyle photography. Each category represents a unique 
            approach to visual storytelling, showcasing technical mastery and artistic vision 
            refined through years of professional experience.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {portfolioCategories.map((category, index) => (
            <Link
              key={category.title}
              to={category.href}
              className="group animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-[4/5] overflow-hidden mb-8">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover image-hover-effect"
                />
                <div className="image-overlay">
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="font-playfair text-4xl font-light text-white mb-2">{category.title}</h3>
                    <p className="text-gray-300 font-light tracking-wide">{category.count}</p>
                  </div>
                </div>
              </div>
              <div className="px-2">
                <h3 className="font-playfair text-2xl font-light mb-4 group-hover:text-photo-red transition-colors duration-300">
                  {category.title}
                </h3>
                <p className="editorial-text">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="luxury-spacing section-padding bg-photo-gray-900">
        <div className="text-center">
          <h2 className="font-playfair text-5xl md:text-6xl font-light mb-8">Ready to Create Something Extraordinary?</h2>
          <p className="editorial-text mb-12 max-w-3xl mx-auto">
            Let's collaborate to bring your vision to life through sophisticated photography 
            that captures not just moments, but the essence of your story.
          </p>
          <Link to="/contact" className="photo-button">
            Start Your Project
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Portfolio;
