
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled ? 'bg-photo-black/95 backdrop-blur-md py-4' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-8xl mx-auto px-8 md:px-16">
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
            {isMenuOpen ? (
              <X className="w-7 h-7 text-white" />
            ) : (
              <Menu className="w-7 h-7 text-white" />
            )}
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
  );
};

export default Header;
