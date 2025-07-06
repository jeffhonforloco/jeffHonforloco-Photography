import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Layout from '../components/Layout';

const Portfolio = () => {
  const portfolioCategories = [
    {
      title: 'Beauty',
      description: 'Elegant beauty photography showcasing natural and enhanced aesthetics with sophisticated lighting and composition',
      image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      href: '/portfolio/beauty',
      count: '24 Images'
    },
    {
      title: 'Fashion',
      description: 'Contemporary fashion photography with bold styling, creative concepts, and innovative visual narratives',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      href: '/portfolio/fashion',
      count: '31 Images'
    },
    {
      title: 'Editorial',
      description: 'Storytelling through sophisticated editorial and commercial work with artistic vision and technical excellence',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      href: '/portfolio/editorial',
      count: '18 Images'
    },
    {
      title: 'Glamour',
      description: 'Sophisticated glamour photography with dramatic lighting, elegant styling, and captivating visual appeal',
      image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      href: '/portfolio/glamour',
      count: '22 Images'
    },
    {
      title: 'Lifestyle',
      description: 'Authentic lifestyle moments captured with artistic vision, showcasing real people in beautiful settings',
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      href: '/portfolio/lifestyle',
      count: '27 Images'
    }
  ];

  return (
    <Layout>
      {/* Elegant Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto px-8 md:px-16 text-center">
          <div className="animate-fade-in">
            <h1 className="font-light text-5xl md:text-6xl lg:text-7xl text-white mb-8 tracking-wide leading-tight">
              Portfolio
            </h1>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-photo-red to-transparent mx-auto mb-12"></div>
            <p className="text-gray-300 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed font-light">
              A curated collection of work spanning five distinct specializations, each representing 
              a unique approach to visual storytelling and artistic expression.
            </p>
          </div>
        </div>
      </section>

      {/* Elegant Portfolio Grid */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="space-y-32">
            {portfolioCategories.map((category, index) => (
              <div
                key={category.title}
                className={`grid lg:grid-cols-2 gap-16 lg:gap-24 items-center animate-fade-in ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Image Section */}
                <div className={`relative group ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <Link to={category.href} className="block">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.title}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                      />
                      {/* Elegant Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Hover Content */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="text-center text-white">
                          <div className="w-16 h-16 bg-photo-red/90 rounded-full flex items-center justify-center mx-auto mb-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                            <ArrowRight className="w-6 h-6" />
                          </div>
                          <p className="text-sm font-medium uppercase tracking-wider">View Collection</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Elegant Border Accent */}
                    <div className="absolute -bottom-2 -right-2 w-full h-full border border-photo-red/20 -z-10 group-hover:border-photo-red/40 transition-colors duration-500"></div>
                  </Link>
                </div>

                {/* Content Section */}
                <div className={`space-y-8 ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-px bg-photo-red"></div>
                      <span className="text-photo-red text-sm font-medium uppercase tracking-widest">
                        0{index + 1}
                      </span>
                    </div>
                    
                    <h2 className="font-light text-4xl md:text-5xl lg:text-6xl text-white mb-6 tracking-wide">
                      {category.title}
                    </h2>
                    
                    <div className="w-16 h-px bg-gray-600 mb-8"></div>
                    
                    <p className="text-gray-300 text-lg leading-relaxed font-light mb-8 max-w-lg">
                      {category.description}
                    </p>
                    
                    <div className="flex items-center justify-between max-w-lg">
                      <span className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                        {category.count}
                      </span>
                      
                      <Link
                        to={category.href}
                        className="group inline-flex items-center text-white hover:text-photo-red transition-colors duration-300"
                      >
                        <span className="text-sm font-medium uppercase tracking-wide mr-3">
                          Explore Collection
                        </span>
                        <div className="w-8 h-8 border border-current rounded-full flex items-center justify-center group-hover:bg-photo-red group-hover:border-photo-red transition-all duration-300">
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Elegant Closing Section */}
      <section className="py-32 bg-gradient-to-t from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-8 md:px-16 text-center">
          <div className="animate-fade-in">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-photo-red to-transparent mx-auto mb-12"></div>
            <p className="text-gray-400 text-lg font-light leading-relaxed italic max-w-2xl mx-auto">
              "Each photograph is a moment frozen in time, a story waiting to be told, 
              and a memory crafted to last forever."
            </p>
            <div className="mt-8">
              <span className="text-gray-500 text-sm font-medium uppercase tracking-widest">
                — Jeff Honforloco
              </span>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Portfolio;