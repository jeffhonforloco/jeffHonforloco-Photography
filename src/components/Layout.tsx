
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Journal', href: '/journal' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || 
           (path === '/portfolio' && location.pathname.startsWith('/portfolio')) ||
           (path === '/journal' && location.pathname.startsWith('/journal'));
  };

  return (
    <div className="min-h-screen bg-photo-black text-photo-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-photo-black/95 backdrop-blur-md py-4' : 'bg-transparent py-6'
      }`}>
        <div className="section-padding">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="font-playfair text-2xl md:text-3xl font-light tracking-wider hover:text-photo-red transition-colors duration-300">
              JEFF HONFORLOCO
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-12">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`nav-link ${
                    isActive(item.href) ? 'text-photo-red' : 'text-photo-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden z-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-7 h-7 flex flex-col justify-center space-y-1.5">
                <span className={`block h-0.5 w-7 bg-white transform transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`block h-0.5 w-7 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 w-7 bg-white transform transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className={`md:hidden absolute top-0 left-0 w-full h-screen bg-photo-black/98 backdrop-blur-md transform transition-all duration-500 ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
            <div className="flex flex-col justify-center items-center h-full space-y-8">
              {navigation.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-3xl font-playfair font-light tracking-wider transition-all duration-300 hover:text-photo-red transform ${
                    isActive(item.href) ? 'text-photo-red' : 'text-photo-white'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 luxury-spacing">
        <div className="section-padding">
          <div className="grid md:grid-cols-3 gap-16">
            <div>
              <h3 className="font-playfair text-3xl font-light mb-6">Jeff Honforloco</h3>
              <p className="editorial-text">
                Professional portrait, fashion, and editorial photography with a focus on 
                capturing authentic moments and creating compelling visual narratives that 
                resonate with sophistication and artistic vision.
              </p>
            </div>
            <div>
              <h4 className="font-inter font-medium mb-6 tracking-wider uppercase text-sm">Navigation</h4>
              <div className="space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block text-gray-400 hover:text-photo-red transition-colors duration-300 font-light"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-inter font-medium mb-6 tracking-wider uppercase text-sm">Connect</h4>
              <div className="space-y-4">
                <a href="https://instagram.com/jeffhonforloco" target="_blank" rel="noopener noreferrer" 
                   className="block text-gray-400 hover:text-photo-red transition-colors duration-300 font-light">
                  Instagram
                </a>
                <a href="https://youtube.com/@jeffhonforloco" target="_blank" rel="noopener noreferrer" 
                   className="block text-gray-400 hover:text-photo-red transition-colors duration-300 font-light">
                  YouTube
                </a>
                <Link to="/contact" className="block text-gray-400 hover:text-photo-red transition-colors duration-300 font-light">
                  Book a Session
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-16 pt-8 text-center">
            <p className="text-gray-500 font-light tracking-wide">
              &copy; 2024 Jeff Honforloco Photography. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
