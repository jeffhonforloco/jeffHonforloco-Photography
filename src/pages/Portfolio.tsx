import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Layout from '../components/Layout';

const Portfolio = () => {
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
    },
    {
      title: 'Lifestyle',
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      href: '/portfolio/lifestyle'
    },
    {
      title: 'Motion',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      href: '/portfolio/motion'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-black">

        {/* Grid Layout */}
        <div className="px-8 pt-32 pb-20">
          <div className="max-w-7xl mx-auto">
            {/* First Row - Beauty (large) + Fashion */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 h-[400px] md:h-[500px]">
              {/* Beauty - Takes 2 columns on desktop */}
              <Link 
                to={portfolioCategories[0].href}
                className="md:col-span-2 relative group overflow-hidden bg-gray-900"
              >
                <img
                  src={portfolioCategories[0].image}
                  alt={portfolioCategories[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
                <div className="absolute bottom-8 left-8">
                  <h2 className="text-3xl md:text-4xl font-light text-white tracking-wide">
                    {portfolioCategories[0].title}
                  </h2>
                </div>
              </Link>

              {/* Fashion - Takes 1 column on desktop */}
              <Link 
                to={portfolioCategories[1].href}
                className="relative group overflow-hidden bg-gray-900"
              >
                <img
                  src={portfolioCategories[1].image}
                  alt={portfolioCategories[1].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
                <div className="absolute bottom-8 left-8">
                  <h2 className="text-2xl md:text-3xl font-light text-white tracking-wide">
                    {portfolioCategories[1].title}
                  </h2>
                </div>
              </Link>
            </div>

            {/* Second Row - Editorial + Glamour + Lifestyle */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[300px] md:h-[400px] mb-4">
              {/* Editorial */}
              <Link 
                to={portfolioCategories[2].href}
                className="relative group overflow-hidden bg-gray-900"
              >
                <img
                  src={portfolioCategories[2].image}
                  alt={portfolioCategories[2].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
                <div className="absolute bottom-8 left-8">
                  <h2 className="text-2xl md:text-3xl font-light text-white tracking-wide">
                    {portfolioCategories[2].title}
                  </h2>
                </div>
              </Link>

              {/* Glamour */}
              <Link 
                to={portfolioCategories[3].href}
                className="relative group overflow-hidden bg-gray-900"
              >
                <img
                  src={portfolioCategories[3].image}
                  alt={portfolioCategories[3].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
                <div className="absolute bottom-8 left-8">
                  <h2 className="text-2xl md:text-3xl font-light text-white tracking-wide">
                    {portfolioCategories[3].title}
                  </h2>
                </div>
              </Link>

              {/* Lifestyle */}
              <Link 
                to={portfolioCategories[4].href}
                className="relative group overflow-hidden bg-gray-900"
              >
                <img
                  src={portfolioCategories[4].image}
                  alt={portfolioCategories[4].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
                <div className="absolute bottom-8 left-8">
                  <h2 className="text-2xl md:text-3xl font-light text-white tracking-wide">
                    {portfolioCategories[4].title}
                  </h2>
                </div>
              </Link>
            </div>

            {/* Third Row - Motion (Full Width) */}
            <div className="h-[250px] md:h-[300px]">
              <Link 
                to={portfolioCategories[5].href}
                className="block relative group overflow-hidden bg-gray-900 h-full"
              >
                <img
                  src={portfolioCategories[5].image}
                  alt={portfolioCategories[5].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
                <div className="absolute bottom-8 left-8">
                  <h2 className="text-3xl md:text-4xl font-light text-white tracking-wide">
                    {portfolioCategories[5].title}
                  </h2>
                </div>
              </Link>
            </div>
          </div>

          {/* Copyright Notice */}
          <div className="text-center mt-16 pb-8">
            <p className="text-gray-500 text-sm">
              © 2025 Jeff Honforloco Photography. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Portfolio;