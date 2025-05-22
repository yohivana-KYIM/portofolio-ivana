import React, { useEffect, useRef, useState } from 'react';
import ThreeScene from './ThreeScene';
import { ArrowDown, ChevronRight, MousePointer, Github, Linkedin, Globe, Mail, Phone } from 'lucide-react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Hero: React.FC = () => {
  const typingTextRef = useRef<HTMLSpanElement>(null);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const texts = [
    "Je suis développeuse web fullstack",
    "Je conçois des applications web",
    "Je développe des sites web",
    <span className="text-green-500">J'implémente l'analyse et l'optimisation</span>
  ];

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  useEffect(() => {
    const typingEffect = () => {
      const roles = ["Développeuse Full Stack", "Intégratrice Web", "UI/UX Designer", "Problem Solver"];
      let currentRoleIndex = 0;
      let currentCharIndex = 0;
      let isDeleting = false;
      let typingSpeed = 100;
      let pauseDuration = 1500;

      const type = () => {
        const currentRole = roles[currentRoleIndex];
        
        if (typingTextRef.current) {
          if (!isDeleting) {
            typingTextRef.current.textContent = currentRole.substring(0, currentCharIndex + 1);
            currentCharIndex++;

            if (currentCharIndex === currentRole.length) {
              isDeleting = true;
              typingSpeed = pauseDuration;
            }
          } else {
            typingTextRef.current.textContent = currentRole.substring(0, currentCharIndex);
            currentCharIndex--;

            if (currentCharIndex === 0) {
              isDeleting = false;
              currentRoleIndex = (currentRoleIndex + 1) % roles.length;
              typingSpeed = 100;
            }
          }
        }

        setTimeout(type, typingSpeed);
      };

      type();
    };

    typingEffect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const buttonHoverVariants = {
    hover: {
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.4)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const socialIconVariants = {
    hover: {
      y: -3,
      scale: 1.1,
      color: "rgb(124, 58, 237)"
    }
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      ref={ref}
    >
      {/* Enhanced 3D Background with Particles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50 to-white dark:from-gray-900 dark:via-purple-900/10 dark:to-gray-900"></div>
        
        {/* Animated Grid Background */}
        <div className="absolute inset-0 grid grid-cols-12 gap-1 opacity-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div 
              key={`grid-col-${i}`}
              className="h-full border-r border-gray-300 dark:border-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.05 }}
              transition={{ delay: i * 0.05, duration: 1 }}
            />
          ))}
        </div>
        <div className="absolute inset-0 grid grid-rows-12 gap-1 opacity-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div 
              key={`grid-row-${i}`}
              className="w-full border-b border-gray-300 dark:border-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.05 }}
              transition={{ delay: i * 0.05, duration: 1 }}
            />
          ))}
        </div>
        
        {/* Floating Blobs */}
        <motion.div 
          className="absolute top-[20%] right-[10%] w-64 h-64 rounded-full bg-purple-400/10 blur-3xl"
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-[10%] left-[5%] w-48 h-48 rounded-full bg-emerald-400/10 blur-3xl"
          animate={{
            y: [0, 30, 0],
            x: [0, -20, 0]
          }}
          transition={{
            duration: 12,
            delay: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* 3D Scene - Positioned for optimal viewing */}
      <div className="absolute right-0 md:right-10 lg:right-20 top-1/2 transform -translate-y-1/2 w-full md:w-1/2 lg:w-2/5 h-80 md:h-96 z-10">
        <ThreeScene className="w-full h-full" />
      </div>
      
      {/* Main Content */}
      <motion.div 
        className="section-container relative z-20"
        initial="hidden"
        animate={controls}
        variants={containerVariants}
      >
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div 
            className="w-full md:w-3/5 space-y-6 text-center md:text-left py-8 md:py-0 px-4 md:px-0"
            variants={itemVariants}
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 px-4 py-1.5 rounded-full mb-4"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <motion.span 
                className="w-2 h-2 bg-purple-600 dark:bg-purple-300 rounded-full mr-2"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              Développeuse Web Full Stack
            </motion.div>
            
            {/* Name */}
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
              variants={itemVariants}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-400 dark:to-pink-400">
                KENMEGNE YOH IVANA MARINA
              </span>
            </motion.h1>
            
            {/* Typing Text */}
            <motion.p 
              className="text-xl md:text-2xl max-w-lg flex items-center justify-center md:justify-start"
              variants={itemVariants}
            >
              <motion.span 
                className="font-semibold"
                animate={{
                  color: [
                    '#FF6B6B', // Rouge corail
                    '#4ECDC4', // Turquoise
                    '#45B7D1', // Bleu ciel
                    '#96CEB4', // Vert menthe
                    '#FFEEAD', // Jaune pâle
                    '#D4A5A5', // Rose poudré
                    '#9B59B6', // Violet
                    '#3498DB'  // Bleu
                  ]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                {texts[currentTextIndex]}
              </motion.span>
            </motion.p>
            
            {/* Buttons */}
            <motion.div 
              className="flex flex-wrap gap-4 justify-center md:justify-start"
              variants={itemVariants}
            >
              <motion.a 
                href="#contact" 
                className="relative px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-full overflow-hidden transition-all duration-300 flex items-center gap-2 group"
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap="tap"
                onHoverStart={() => setHoveredButton('contact')}
                onHoverEnd={() => setHoveredButton(null)}
              >
                <AnimatePresence>
                  {hoveredButton === 'contact' && (
                    <motion.span 
                      className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </AnimatePresence>
                <span className="relative z-10">Me Contacter</span>
                <ChevronRight size={16} className="relative z-10 transition-transform group-hover:translate-x-1" />
              </motion.a>
              
              <motion.a 
                href="#projects" 
                className="relative px-6 py-3 border-2 border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 rounded-full overflow-hidden transition-all duration-300 flex items-center gap-2 group"
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap="tap"
                onHoverStart={() => setHoveredButton('projects')}
                onHoverEnd={() => setHoveredButton(null)}
              >
                <AnimatePresence>
                  {hoveredButton === 'projects' && (
                    <motion.span 
                      className="absolute inset-0 bg-purple-600/10 dark:bg-purple-400/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </AnimatePresence>
                <span className="relative z-10">Voir Projets</span>
                <ChevronRight size={16} className="relative z-10" />
              </motion.a>
            </motion.div>
            
            {/* Social Links */}
            <motion.div 
              className="flex items-center justify-center md:justify-start space-x-6 mt-8"
              variants={itemVariants}
            >
              <motion.a 
                href="https://github.com/yohivana-KYIM" 
                target="_blank"
                rel="noopener noreferrer" 
                className="text-gray-600 dark:text-gray-400"
                variants={socialIconVariants}
                whileHover="hover"
                aria-label="GitHub"
              >
                <Github size={24} />
              </motion.a>
              <motion.a 
                href="https://www.linkedin.com/in/kenmegne-yoh-ivana-marina-a656a92a0" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400"
                variants={socialIconVariants}
                whileHover="hover"
                aria-label="LinkedIn"
              >
                <Linkedin size={24} />
              </motion.a>
              <motion.a 
                href="https://portfolio-ivana.onrender.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400"
                variants={socialIconVariants}
                whileHover="hover"
                aria-label="Portfolio"
              >
                <Globe size={24} />
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Floating Code Snippet - Only on large screens */}
      <motion.div 
        className="absolute left-4 top-1/3 w-1/4 h-1/2 opacity-20 hidden lg:block overflow-hidden"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 0.2, x: 0 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        <pre className="text-xs text-purple-600 dark:text-purple-400 whitespace-pre">
          <code>
{`function Portfolio() {
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    const response = await fetch('/api/portfolio');
    const data = await response.json();
    setSkills(data.skills);
    setProjects(data.projects);
  }
  
  return (
    <div className="portfolio">
      <Header />
      <HeroSection />
      <AboutMe />
      <Skills data={skills} />
      <Projects data={projects} />
      <Contact />
    </div>
  );
}`}
          </code>
        </pre>
      </motion.div>
      
      {/* 3D Animated Cursor */}
      <motion.div 
        className="absolute bottom-24 right-1/4 hidden md:flex"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <MousePointer size={32} className="text-purple-600 dark:text-purple-400" />
      </motion.div>
      
      {/* Scroll Down Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, 10, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <a href="#about" className="flex flex-col items-center text-purple-600 dark:text-purple-400">
          <span className="text-sm mb-2">Scroll</span>
          <ArrowDown size={24} />
        </a>
      </motion.div>
    </section>
  );
};

export default Hero;