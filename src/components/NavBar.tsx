import React, { useState, useEffect } from 'react';
import { Menu, X, Code, Home, User, Briefcase, Wrench, Send } from 'lucide-react';

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Update active section based on scroll position
      const sections = document.querySelectorAll('section[id]');
      sections.forEach(section => {
        const htmlSection = section as HTMLElement;
        const sectionTop = htmlSection.offsetTop - 100;
        const sectionHeight = htmlSection.offsetHeight;
        const sectionId = htmlSection.getAttribute('id') || '';
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
          setActiveSection(sectionId);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navItems = [
    { label: 'Accueil', href: '#home', icon: <Home size={18} /> },
    { label: 'À Propos', href: '#about', icon: <User size={18} /> },
    { label: 'Compétences', href: '#skills', icon: <Wrench size={18} /> },
    { label: 'Expériences', href: '#experience', icon: <Briefcase size={18} /> },
    { label: 'Projets', href: '#projects', icon: <Code size={18} /> },
    { label: 'Contact', href: '#contact', icon: <Send size={18} /> },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-md py-2' : 'bg-transparent py-3 sm:py-4'
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12 sm:h-14">
          {/* Logo */}
          <a 
            href="#home" 
            className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 z-50"
          >
            <span className="text-purple-600">KYIM</span>
            <span className="hidden xs:inline">Portfolio</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block">
            <ul className="flex items-center space-x-2 xl:space-x-4">
              {navItems.map((item, index) => (
                <li key={index}>
                  <a 
                    href={item.href}
                    onClick={closeMenu}
                    className={`text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 text-sm xl:text-base font-medium flex items-center gap-1.5 py-2 px-2 xl:px-3 rounded-full whitespace-nowrap ${
                      activeSection === item.href.replace('#', '') ? 
                      'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 
                      'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.icon}
                    <span className="hidden xl:inline">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Tablet Navigation */}
          <nav className="hidden md:block lg:hidden">
            <ul className="flex items-center space-x-1">
              {navItems.map((item, index) => (
                <li key={index}>
                  <a 
                    href={item.href}
                    onClick={closeMenu}
                    className={`text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 p-2 rounded-full ${
                      activeSection === item.href.replace('#', '') ? 
                      'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 
                      'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    title={item.label}
                  >
                    {item.icon}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-900 dark:text-white hover:text-purple-600 p-2 rounded-full transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 z-50"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Navigation Menu */}
      <div 
        className={`md:hidden fixed top-0 right-0 h-full w-72 sm:w-80 bg-white dark:bg-gray-900 shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              <span className="text-purple-600">KYIM</span> Portfolio
            </div>
            <button 
              onClick={closeMenu}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-2 px-4">
              {navItems.map((item, index) => (
                <li key={index}>
                  <a 
                    href={item.href}
                    onClick={closeMenu}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 ${
                      activeSection === item.href.replace('#', '') ? 
                      'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 
                      ''
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      activeSection === item.href.replace('#', '') ? 
                      'bg-purple-200 dark:bg-purple-800' : 
                      'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default NavBar;