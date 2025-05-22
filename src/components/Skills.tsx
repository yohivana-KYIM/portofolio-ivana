import React, { useEffect, useState, useRef } from 'react';

interface SkillProps {
  name: string;
  percentage: number;
  color: string;
  delay?: number;
}

const Skill: React.FC<SkillProps> = ({ name, percentage, color, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const skillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
            // Animate percentage counter
            let start = 0;
            const duration = 1500;
            const increment = percentage / (duration / 16);
            
            const timer = setInterval(() => {
              start += increment;
              if (start >= percentage) {
                start = percentage;
                clearInterval(timer);
              }
              setAnimatedPercentage(Math.floor(start));
            }, 16);
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (skillRef.current) {
      observer.observe(skillRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [percentage, delay]);

  const circumference = 2 * Math.PI * 35;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div 
      ref={skillRef} 
      className="group flex flex-col items-center transform transition-all duration-500 hover:scale-105"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative mb-4 transition-all duration-300 group-hover:drop-shadow-xl">
        <svg width="100" height="100" viewBox="0 0 100 100" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="35"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="35"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={isVisible ? offset : circumference}
            className="transition-all duration-1500 ease-out drop-shadow-sm"
            style={{ 
              filter: `drop-shadow(0 0 6px ${color}40)`,
            }}
          />
          {/* Glow effect */}
          <circle
            cx="50"
            cy="50"
            r="35"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={isVisible ? offset : circumference}
            className="opacity-30 transition-all duration-1500 ease-out"
            style={{ filter: `blur(2px)` }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold">{percentage}%</span>
        </div>
        
        {/* Decorative dot */}
        <div 
          className="absolute w-2 h-2 rounded-full transition-all duration-1500 ease-out"
          style={{ 
            backgroundColor: color,
            top: '8px',
            left: '50%',
            transform: `translateX(-50%) rotate(${isVisible ? (percentage / 100) * 360 : 0}deg) translateY(35px)`,
            transformOrigin: '50% 42px',
            boxShadow: `0 0 8px ${color}80`
          }}
        />
      </div>
      
      <h4 className="font-medium text-center text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300 group-hover:text-gray-900 dark:group-hover:text-white">
        {name}
      </h4>
    </div>
  );
};

const Skills: React.FC = () => {
  const [activeSection, setActiveSection] = useState(0);
  
  const skillsData = [
    { name: 'Vue.js', percentage: 70, color: '#41B883' },
    { name: 'React.js', percentage: 45, color: '#61DAFB' },
    { name: 'Node.js', percentage: 40, color: '#339933' },
    { name: 'Laravel', percentage: 75, color: '#FF2D20' },
    { name: 'MongoDB', percentage: 60, color: '#47A248' },
    { name: 'Tailwind CSS', percentage: 60, color: '#06B6D4' },
    { name: 'SQL', percentage: 80, color: '#F29111' },
    { name: 'WordPress', percentage: 30, color: '#21759B' }
  ];

  const toolsData = [
    { name: 'VS Code', percentage: 95, color: '#007ACC' },
    { name: 'GitHub', percentage: 85, color: '#181717' },
    { name: 'GitLab', percentage: 80, color: '#FCA121' },
    { name: 'Postman', percentage: 75, color: '#FF6C37' },
    { name: 'Figma', percentage: 40, color: '#F24E1E' },
    { name: 'Jira', percentage: 75, color: '#0052CC' },
    { name: 'Trello', percentage: 85, color: '#0079BF' },
    { name: 'Docker', percentage: 30, color: '#2496ED' },
    { name: 'Confluence', percentage: 50, color: '#172B4D' }
  ];

  const methodologies = [
    { category: 'Méthodologies', items: ['Scrum', 'Agile', 'Kanban', 'DevOps'] },
    { category: 'Modélisation', items: ['UML', 'Merise', 'ERD', 'Wireframing'] },
    { category: 'Bases de données', items: ['SQL', 'NoSQL', 'MongoDB', 'PostgreSQL'] }
  ];

  return (
    <section id="skills" className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
            Mes Compétences
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Un aperçu de mes compétences techniques et des outils que j'utilise au quotidien
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white dark:bg-gray-800 rounded-xl p-1 shadow-lg border border-gray-200 dark:border-gray-700">
            {['Langages & Frameworks', 'Outils & Technologies', 'Méthodologies'].map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveSection(index)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 text-sm ${
                  activeSection === index
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md transform scale-105'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="relative overflow-hidden">
          {/* Languages & Frameworks */}
          <div className={`transition-all duration-700 ${activeSection === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 absolute inset-0 pointer-events-none'}`}>
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8 md:gap-12">
                {skillsData.map((skill, index) => (
                  <Skill key={skill.name} {...skill} delay={index * 100} />
                ))}
              </div>
            </div>
          </div>

          {/* Tools & Technologies */}
          <div className={`transition-all duration-700 ${activeSection === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 absolute inset-0 pointer-events-none'}`}>
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 md:gap-12">
                {toolsData.map((tool, index) => (
                  <Skill key={tool.name} {...tool} delay={index * 100} />
                ))}
              </div>
            </div>
          </div>

          {/* Methodologies */}
          <div className={`transition-all duration-700 ${activeSection === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 absolute inset-0 pointer-events-none'}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {methodologies.map((methodology, index) => (
                <div 
                  key={methodology.category}
                  className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-center mb-6">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-3 shadow-lg"></div>
                    <h4 className="text-xl font-bold text-gray-800 dark:text-white">
                      {methodology.category}
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {methodology.items.map((item, itemIndex) => (
                      <div 
                        key={item}
                        className="flex items-center p-3 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg transition-all duration-300 hover:bg-gray-100/50 dark:hover:bg-gray-600/50 transform hover:translate-x-2"
                        style={{ transitionDelay: `${(index * 150) + (itemIndex * 100)}ms` }}
                      >
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mr-3"></div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="flex justify-center mt-16">
          <div className="flex space-x-2">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeSection === index 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 scale-125' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;