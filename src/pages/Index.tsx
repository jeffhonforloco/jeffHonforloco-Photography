
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const Index = () => {
  const portfolioCategories = [
    {
      title: 'Beauty',
      image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      href: '/portfolio/beauty'
    },
    {
      title: 'Fashion',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      href: '/portfolio/fashion'
    },
    {
      title: 'Editorial',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      href: '/portfolio/editorial'
    },
    {
      title: 'Glamour',
      image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      href: '/portfolio/glamour'
    }
  ];

  const latestJournalPosts = [
    {
      title: 'Mastering Natural Light in Portrait Photography',
      excerpt: 'Discover the secrets to creating stunning portraits using only natural light sources and professional techniques.',
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      href: '/journal/mastering-natural-light'
    },
    {
      title: 'Building Your Fashion Photography Portfolio',
      excerpt: 'Essential tips for creating a compelling fashion photography portfolio that captures attention and showcases your unique style.',
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      href: '/journal/building-fashion-portfolio'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-section flex items-center justify-center relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30"></div>
        </div>
        
        <div className="relative z-10 text-center section-padding animate-fade-in-up">
          <h1 className="editorial-title animate-scale-in-slow">
            JEFF HONFORLOCO
          </h1>
          <p className="editorial-subtitle mb-12 max-w-2xl mx-auto">
            Professional Portrait & Fashion Photography
          </p>
          <p className="editorial-text mb-16 max-w-4xl mx-auto">
            Capturing authentic moments and creating compelling visual narratives through 
            the intersection of artistic vision, technical mastery, and sophisticated storytelling.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/portfolio" className="photo-button">
              View Portfolio
            </Link>
            <Link to="/contact" className="photo-button-outline">
              Book a Session
            </Link>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-photo-white to-transparent"></div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="luxury-spacing section-padding">
        <div className="text-center mb-24">
          <h2 className="font-playfair text-6xl md:text-7xl font-light mb-8">Portfolio</h2>
          <p className="editorial-text max-w-3xl mx-auto">
            A curated collection showcasing the breadth and depth of creative vision across 
            multiple photography disciplines, each telling its own unique story.
          </p>
        </div>

        <div className="portfolio-category-grid mb-20">
          {portfolioCategories.map((category, index) => (
            <Link
              key={category.title}
              to={category.href}
              className="portfolio-item animate-scale-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover image-hover-effect"
              />
              <div className="image-overlay">
                <div className="absolute bottom-8 left-8">
                  <h3 className="font-playfair text-3xl font-light text-white tracking-wide">{category.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link to="/portfolio" className="photo-button">
            Explore All Work
          </Link>
        </div>
      </section>

      {/* About Preview */}
      <section className="luxury-spacing section-padding bg-photo-gray-900">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="animate-slide-up">
            <h2 className="font-playfair text-6xl md:text-7xl font-light mb-8">About Jeff</h2>
            <p className="editorial-text mb-8">
              With over a decade of experience in professional photography, I specialize in 
              creating compelling visual stories that capture the essence and authenticity of my subjects. 
              My work spans fashion, beauty, editorial, and lifestyle photography with a focus on 
              sophisticated storytelling.
            </p>
            <p className="editorial-text mb-12">
              Every photograph is an opportunity to create something extraordinary—combining 
              technical precision with artistic vision to deliver images that not only document 
              moments but elevate them into lasting works of art.
            </p>
            <Link to="/about" className="photo-button">
              Discover More
            </Link>
          </div>
          <div className="relative animate-scale-in">
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Jeff Honforloco"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Latest Journal Posts */}
      <section className="luxury-spacing section-padding">
        <div className="text-center mb-24">
          <h2 className="font-playfair text-6xl md:text-7xl font-light mb-8">Journal</h2>
          <p className="editorial-text max-w-3xl mx-auto">
            Insights, techniques, and stories from behind the lens—sharing knowledge 
            and inspiration from the world of professional photography.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          {latestJournalPosts.map((post, index) => (
            <Link
              key={post.title}
              to={post.href}
              className="group animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="aspect-[16/10] overflow-hidden mb-8">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover image-hover-effect"
                />
              </div>
              <h3 className="font-playfair text-3xl md:text-4xl font-light mb-6 group-hover:text-photo-red transition-colors duration-300 leading-tight">
                {post.title}
              </h3>
              <p className="editorial-text">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link to="/journal" className="photo-button">
            Read All Articles
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
