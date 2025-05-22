
import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      
      // Calculate scroll progress
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / scrollHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', toggleVisibility);
    
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const circumference = 2 * Math.PI * 18; // 18 is the radius of the circle

  return (
    <div 
      className={`fixed bottom-8 right-8 z-50 transition-all duration-500 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-12 pointer-events-none'
      }`}
    >
      <button
        onClick={scrollToTop}
        className="relative flex items-center justify-center w-14 h-14 bg-white dark:bg-portfolio-dark shadow-lg rounded-full hover:scale-110 transition-transform duration-300 border border-gray-200 dark:border-gray-800 group"
        aria-label="Scroll to top"
      >
        <svg width="56" height="56" viewBox="0 0 56 56" className="absolute">
          <circle 
            cx="28" 
            cy="28" 
            r="18" 
            fill="none"
            stroke="#f0f0f0"
            strokeWidth="2"
            className="dark:stroke-gray-800"
          />
          <circle 
            cx="28" 
            cy="28" 
            r="18" 
            fill="none"
            stroke="#d4c2fc"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (scrollProgress / 100) * circumference}
            transform="rotate(-90 28 28)"
            className="transition-all duration-300 group-hover:stroke-portfolio-purple"
          />
        </svg>
        <ArrowUp 
          size={20} 
          className="text-portfolio-purple group-hover:text-portfolio-purple group-hover:-translate-y-1 transition-transform duration-300" 
        />
      </button>
    </div>
  );
};

export default ScrollTop;
