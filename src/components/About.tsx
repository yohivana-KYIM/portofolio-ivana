import React, { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, Mail, Phone, MapPin, FileText, Download, Star, Award, Code, Heart, Coffee, Zap, Globe, Users, Target, Sparkles } from 'lucide-react';

const About: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
    }
  };

  const stats = [
    { number: "3+", label: "Années d'expérience", icon: Award },
    { number: "15+", label: "Projets réalisés", icon: Code },
    { number: "5+", label: "Technologies maîtrisées", icon: Zap },
    { number: "100%", label: "Satisfaction client", icon: Heart }
  ];

  const softSkills = [
    { skill: "Communication", level: 95, color: "from-purple-500 to-pink-500" },
    { skill: "Autonomie", level: 90, color: "from-blue-500 to-cyan-500" },
    { skill: "Travail d'équipe", level: 92, color: "from-green-500 to-emerald-500" },
    { skill: "Problem Solving", level: 88, color: "from-orange-500 to-red-500" }
  ];

  const languages = [
    { lang: "Français", level: "Natif", flag: "🇫🇷" }
  ];

  const contactInfo = [
    { icon: MapPin, label: "Localisation", value: "Douala, Cameroun", link: "" },
    { icon: Phone, label: "Téléphone", value: "+237 671 178 991", link: "tel:+237671178991" },
    { icon: Mail, label: "Email", value: "yohivana794@gmail.com", link: "mailto:yohivana794@gmail.com" },
    { icon: Github, label: "GitHub", value: "yohivana-KYIM", link: "https://github.com/yohivana-KYIM" },
    { icon: Linkedin, label: "LinkedIn", value: "Profil professionnel", link: "https://www.linkedin.com/in/kenmegne-yoh-ivana-marina-a656a92a0" }
  ];

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="relative py-20 lg:py-32 bg-gradient-to-br from-white via-gray-50 to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/30 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-32 right-16 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl animate-float-reverse"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-pink-400/25 rounded-full blur-2xl animate-bounce-slow"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-10 animate-float-slow opacity-20">
          <Code className="text-purple-500" size={32} />
        </div>
        <div className="absolute bottom-1/3 right-20 animate-bounce-slow opacity-20" style={{animationDelay: '1s'}}>
          <Sparkles className="text-blue-500" size={28} />
        </div>
        <div className="absolute top-2/3 left-1/4 animate-pulse opacity-20" style={{animationDelay: '2s'}}>
          <Heart className="text-pink-500" size={24} />
        </div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className={`inline-flex items-center px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Users className="mr-2" size={16} />
            Faisons connaissance
          </div>
          <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            À Propos de Moi
          </h2>
          <p className={`text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Développeuse passionnée, je transforme des idées en expériences digitales exceptionnelles
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Profile Section */}
          <div className="lg:col-span-4 space-y-8">
          {/* Profile Photo */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-purple-500/20 shadow-xl">
                  <img
                    src="/profil.jpeg"
                    alt="Yoh Ivana"
                className="w-full h-full object-cover"
              />
                </div>
                <div className="absolute -top-2 -right-2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-pulse">
                  Disponible
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className={`grid grid-cols-2 gap-4 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {stats.map((stat, index) => (
                <div key={index} className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:-translate-y-1">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <stat.icon className="text-white" size={20} />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.number}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 leading-tight">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Content Section */}
          <div className="lg:col-span-8 space-y-8">
            {/* Introduction */}
            <div className={`space-y-6 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="absolute top-6 right-6 opacity-10">
                  <Coffee size={40} />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Développeuse Web Full Stack
            </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  Avec 3 années d'expérience, je suis spécialisée dans la création d'expériences web 
                  modernes et performantes. Titulaire d'une Licence professionnelle MIAW et d'un BTS 
                  en Génie Logiciel, j'allie expertise technique et vision créative.
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  Ma passion pour l'innovation technologique me pousse à explorer constamment 
                  de nouvelles solutions pour créer des applications qui font la différence.
                </p>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className={`space-y-6 transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Target className="text-purple-600" size={24} />
                Contact & Réseaux
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contactInfo.map((item, index) => (
                  <div key={index} className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:-translate-y-1">
                    {item.link ? (
                      <a href={item.link} target={item.link.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer" className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <item.icon className="text-white" size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">{item.label}</div>
                          <div className="text-gray-900 dark:text-white font-medium truncate">{item.value}</div>
              </div>
                      </a>
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                          <item.icon className="text-white" size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">{item.label}</div>
                          <div className="text-gray-900 dark:text-white font-medium">{item.value}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              </div>
              
            {/* CV Download */}
            <div className={`transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <a 
                href="/CV_ivana.pdf" 
                download="CV_Kenmegne_Yoh_Ivana_Marina.pdf"
                className="group relative inline-flex items-center gap-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                    <Download size={20} />
                  </div>
                  <span>Télécharger mon CV</span>
                </div>
                </a>
              </div>
              
            {/* Skills & Languages */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Soft Skills */}
              <div className={`space-y-6 transition-all duration-1000 delay-1100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <Star className="text-yellow-500" size={24} />
                  Soft Skills
                </h4>
                <div className="space-y-4">
                  {softSkills.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900 dark:text-white">{skill.skill}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{skill.level}%</span>
              </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 delay-${1200 + index * 100}`}
                          style={{ width: isVisible ? `${skill.level}%` : '0%' }}
                        ></div>
              </div>
            </div>
                  ))}
                </div>
                </div>
                
              {/* Languages */}
              <div className={`space-y-6 transition-all duration-1000 delay-1200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <Globe className="text-blue-500" size={24} />
                  Langues
                </h4>
                <div className="space-y-4">
                  {languages.map((lang, index) => (
                    <div key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{lang.flag}</span>
                <div>
                            <div className="font-medium text-gray-900 dark:text-white">{lang.lang}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{lang.level}</div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {[...Array(lang.level === 'Natif' ? 5 : 4)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(15px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-float-reverse { animation: float-reverse 8s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
      `}</style>
    </section>
  );
};

export default About;