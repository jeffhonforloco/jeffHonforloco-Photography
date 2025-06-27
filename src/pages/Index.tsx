
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

  const featuredWork = [
    {
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      category: 'Editorial',
      title: 'Vogue Editorial Series'
    },
    {
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      category: 'Fashion',
      title: 'Luxury Brand Campaign'
    },
    {
      image: 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      category: 'Beauty',
      title: 'Cosmetics Campaign'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-5xl mx-auto px-8">
          <div className="mb-8">
            <h1 className="font-playfair text-7xl md:text-8xl lg:text-9xl font-extralight tracking-wider text-white mb-6 leading-[0.85]">
              JEFF
            </h1>
            <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-extralight tracking-[0.2em] text-white/90 mb-12">
              HONFORLOCO
            </h2>
          </div>
          
          <div className="w-32 h-px bg-photo-red mx-auto mb-12"></div>
          
          <p className="font-inter text-xl md:text-2xl font-light text-white/80 tracking-wide leading-relaxed max-w-3xl mx-auto mb-16">
            Award-winning photographer specializing in fashion, beauty, and editorial imagery. 
            Creating compelling visual narratives that transcend the ordinary.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <Link 
              to="/portfolio" 
              className="bg-photo-red hover:bg-photo-red-hover text-white px-12 py-5 font-inter font-medium tracking-[0.15em] uppercase text-sm transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-photo-red/30"
            >
              View Portfolio
            </Link>
            <Link 
              to="/contact" 
              className="border-2 border-white text-white hover:bg-white hover:text-photo-black px-12 py-5 font-inter font-medium tracking-[0.15em] uppercase text-sm transition-all duration-500 hover:scale-105"
            >
              Book Session
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Work Section */}
      <section className="py-32 md:py-40 bg-photo-black">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="text-center mb-24">
            <h2 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-extralight tracking-wide text-white mb-8">
              Featured Work
            </h2>
            <div className="w-24 h-px bg-photo-red mx-auto mb-8"></div>
            <p className="font-inter text-xl font-light text-gray-300 max-w-2xl mx-auto leading-relaxed">
              A curated selection showcasing the depth and artistry of contemporary photography
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            {featuredWork.map((work, index) => (
              <div 
                key={index}
                className="group cursor-pointer"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="relative aspect-[4/5] overflow-hidden mb-8">
                  <img
                    src={work.image}
                    alt={work.title}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <div className="absolute bottom-8 left-8 right-8 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 opacity-0 group-hover:opacity-100">
                    <p className="text-photo-red font-inter text-sm tracking-[0.2em] uppercase mb-2">
                      {work.category}
                    </p>
                    <h3 className="font-playfair text-2xl font-light text-white">
                      {work.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Categories */}
      <section className="py-32 md:py-40 bg-photo-gray-900">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="text-center mb-24">
            <h2 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-extralight tracking-wide text-white mb-8">
              Portfolio
            </h2>
            <div className="w-24 h-px bg-photo-red mx-auto mb-8"></div>
            <p className="font-inter text-xl font-light text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Explore diverse photography disciplines, each crafted with precision and artistic vision
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {portfolioCategories.map((category, index) => (
              <Link
                key={category.title}
                to={category.href}
                className="group block"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-6">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-all duration-500"></div>
                  <div className="absolute bottom-6 left-6">
                    <h3 className="font-playfair text-3xl font-light text-white tracking-wide group-hover:text-photo-red transition-colors duration-300">
                      {category.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link 
              to="/portfolio" 
              className="bg-photo-red hover:bg-photo-red-hover text-white px-12 py-5 font-inter font-medium tracking-[0.15em] uppercase text-sm transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-photo-red/30"
            >
              View All Work
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-32 md:py-40 bg-photo-black">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-extralight tracking-wide text-white mb-8">
                About Jeff
              </h2>
              <div className="w-24 h-px bg-photo-red mb-12"></div>
              
              <p className="font-inter text-xl font-light text-gray-300 leading-relaxed mb-8">
                With over a decade of experience capturing the essence of fashion and beauty, 
                I specialize in creating powerful visual narratives that transcend traditional photography.
              </p>
              
              <p className="font-inter text-xl font-light text-gray-300 leading-relaxed mb-12">
                My work has been featured in leading publications and campaigns worldwide, 
                combining technical mastery with an unwavering commitment to artistic excellence.
              </p>
              
              <Link 
                to="/about" 
                className="inline-flex items-center font-inter font-medium text-white tracking-[0.15em] uppercase text-sm hover:text-photo-red transition-colors duration-300"
              >
                Discover More
                <span className="ml-4 w-12 h-px bg-photo-red"></span>
              </Link>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Jeff Honforloco"
                  className="w-full h-full object-cover hover:scale-105 transition-all duration-700"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 border border-photo-red/30"></div>
              <div className="absolute -top-8 -left-8 w-24 h-24 border border-photo-red/50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-32 md:py-40 bg-photo-gray-900">
        <div className="max-w-7xl mx-auto px-8 md:px-16 text-center">
          <h2 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-extralight tracking-wide text-white mb-16">
            Recognition
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="text-center">
              <div className="text-photo-red font-playfair text-4xl md:text-5xl font-light mb-4">50+</div>
              <p className="font-inter text-lg font-light text-gray-300 tracking-wide">Published Works</p>
            </div>
            <div className="text-center">
              <div className="text-photo-red font-playfair text-4xl md:text-5xl font-light mb-4">15+</div>
              <p className="font-inter text-lg font-light text-gray-300 tracking-wide">Years Experience</p>
            </div>
            <div className="text-center">
              <div className="text-photo-red font-playfair text-4xl md:text-5xl font-light mb-4">100+</div>
              <p className="font-inter text-lg font-light text-gray-300 tracking-wide">Happy Clients</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
