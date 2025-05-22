import React, { useEffect, useRef } from 'react';
import ThreeScene from './ThreeScene';
import { ArrowDown, ChevronRight, MousePointer } from 'lucide-react';

const Hero: React.FC = () => {
  const typingTextRef = useRef<HTMLSpanElement>(null);

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

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Enhanced Background with grid and gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-portfolio-purple/5 to-white dark:from-portfolio-dark dark:via-portfolio-purple/10 dark:to-portfolio-dark"></div>
        <div className="absolute inset-0 grid grid-cols-12 gap-2 opacity-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={`grid-col-${i}`} className="h-full border-r border-gray-300 dark:border-gray-700"></div>
          ))}
        </div>
        <div className="absolute inset-0 grid grid-rows-12 gap-2 opacity-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={`grid-row-${i}`} className="w-full border-b border-gray-300 dark:border-gray-700"></div>
          ))}
        </div>
      </div>

      {/* Three.js Scene as feature element */}
      <div className="absolute right-0 md:right-10 lg:right-20 top-1/2 transform -translate-y-1/2 w-full md:w-1/2 lg:w-2/5 h-80 md:h-96 opacity-90 z-10">
        <ThreeScene className="w-full h-full" />
      </div>
      
      {/* Content */}
      <div className="section-container relative z-20">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-3/5 space-y-6 text-center md:text-left backdrop-blur-sm md:backdrop-blur-none py-8 md:py-0 px-4 md:px-0 rounded-xl md:rounded-none bg-white/5 md:bg-transparent">
            <div className="inline-block notion-fade-in">
              <span className="text-xs md:text-sm bg-portfolio-purple/20 text-portfolio-purple px-4 py-1.5 rounded-full mb-4 inline-flex items-center">
                <span className="w-2 h-2 bg-portfolio-purple rounded-full mr-2 animate-pulse"></span>
                Développeuse Web Full Stack
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight notion-slide-left">
              <span className="text-portfolio-purple">KENMEGNE YOH IVANA MARINA</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-lg notion-fade-in flex items-center" style={{animationDelay: '0.2s'}}>
              Je suis <span className="typing-text text-portfolio-purple font-semibold mx-2" ref={typingTextRef}>Développeuse Full Stack</span>
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start notion-fade-in" style={{animationDelay: '0.4s'}}>
              <a 
                href="#contact" 
                className="px-6 py-3 bg-portfolio-purple text-white rounded-full hover:bg-opacity-90 transition-all duration-300 shadow-lg hover:-translate-y-1 flex items-center gap-2 hover-button"
              >
                Me Contacter
                <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
              <a 
                href="#projects" 
                className="px-6 py-3 border-2 border-portfolio-purple text-portfolio-purple rounded-full hover:bg-portfolio-purple hover:text-white transition-all duration-300 hover:-translate-y-1 flex items-center gap-2"
              >
                Voir Projets
                <ChevronRight size={16} />
              </a>
            </div>
            
            <div className="flex items-center justify-center md:justify-start space-x-6 mt-8 notion-fade-in" style={{animationDelay: '0.6s'}}>
              <a 
                href="https://github.com/yohivana-KYIM" 
                target="_blank"
                rel="noopener noreferrer" 
                className="text-gray-600 hover:text-portfolio-purple transition-colors hover:-translate-y-1 transform duration-300"
                aria-label="GitHub"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/in/kenmegne-yoh-ivana-marina-a656a92a0" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-portfolio-purple transition-colors hover:-translate-y-1 transform duration-300"
                aria-label="LinkedIn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                </svg>
              </a>
              <a 
                href="https://portfolio-ivana.onrender.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-portfolio-purple transition-colors hover:-translate-y-1 transform duration-300"
                aria-label="Portfolio"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855-.143.268-.276.56-.395.872.705.157 1.472.257 2.282.287V1.077zM4.249 3.539c.142-.384.304-.744.481-1.078a6.7 6.7 0 0 1 .597-.933A7.01 7.01 0 0 0 3.051 3.05c.362.184.763.349 1.198.49zM3.509 7.5c.036-1.07.188-2.087.436-3.008a9.124 9.124 0 0 1-1.565-.667A6.964 6.964 0 0 0 1.018 7.5h2.49zm1.4-2.741a12.344 12.344 0 0 0-.4 2.741H7.5V5.091c-.91-.03-1.783-.145-2.591-.332zM8.5 5.09V7.5h2.99a12.342 12.342 0 0 0-.399-2.741c-.808.187-1.681.301-2.591.332zM4.51 8.5c.035.987.176 1.914.399 2.741A13.612 13.612 0 0 1 7.5 10.91V8.5H4.51zm3.99 0v2.409c.91.03 1.783.145 2.591.332.223-.827.364-1.754.4-2.741H8.5zm-3.282 3.696c.12.312.252.604.395.872.552 1.035 1.218 1.65 1.887 1.855V11.91c-.81.03-1.577.13-2.282.287zm.11 2.276a6.696 6.696 0 0 1-.598-.933 8.853 8.853 0 0 1-.481-1.079 8.38 8.38 0 0 0-1.198.49 7.01 7.01 0 0 0 2.276 1.522zm-1.383-2.964A13.36 13.36 0 0 1 3.508 8.5h-2.49a6.963 6.963 0 0 0 1.362 3.675c.47-.258.995-.482 1.565-.667zm6.728 2.964a7.009 7.009 0 0 0 2.275-1.521 8.376 8.376 0 0 0-1.197-.49 8.853 8.853 0 0 1-.481 1.078 6.688 6.688 0 0 1-.597.933zM8.5 11.909v3.014c.67-.204 1.335-.82 1.887-1.855.143-.268.276-.56.395-.872A12.63 12.63 0 0 0 8.5 11.91zm3.555-.401c.57.185 1.095.409 1.565.667A6.963 6.963 0 0 0 14.982 8.5h-2.49a13.36 13.36 0 0 1-.437 3.008zM14.982 7.5a6.963 6.963 0 0 0-1.362-3.675c-.47.258-.995.482-1.565.667.248.92.4 1.938.437 3.008h2.49zM11.27 2.461c.177.334.339.694.482 1.078a8.368 8.368 0 0 0 1.196-.49 7.01 7.01 0 0 0-2.275-1.52c.218.283.418.597.597.932zm-.488 1.343a7.765 7.765 0 0 0-.395-.872C9.835 1.897 9.17 1.282 8.5 1.077V4.09c.81-.03 1.577-.13 2.282-.287z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced code animation */}
      <div className="absolute left-4 top-1/3 w-1/4 md:w-1/3 h-1/2 opacity-20 hidden lg:block overflow-hidden">
        <pre className="text-xs md:text-sm text-portfolio-purple whitespace-pre animate-pulse">
          <code>
{`function Portfolio() {
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    // Fetch portfolio data
    const data = await getPortfolioData();
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
      </div>
      
      {/* 3D cursor animation with pointer */}
      <div className="absolute bottom-24 right-1/4 animate-float hidden md:flex">
        <MousePointer size={32} className="text-portfolio-purple animate-pulse" />
      </div>
      
      {/* Scroll down indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a href="#about" className="flex flex-col items-center text-portfolio-purple">
          <span className="text-sm mb-2">Scroll</span>
          <ArrowDown size={24} />
        </a>
      </div>
      
      {/* Enhanced floating decorations */}
      <div className="absolute top-[20%] right-[10%] w-64 h-64 rounded-full bg-portfolio-purple/10 blur-3xl -z-10 animate-float"></div>
      <div className="absolute bottom-[10%] left-[5%] w-48 h-48 rounded-full bg-portfolio-green/10 blur-3xl -z-10 animate-float" style={{animationDelay: '2s'}}></div>
    </section>
  );
};

export default Hero;
