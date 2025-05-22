import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, MapPin, Calendar, Award, Users, ChevronRight, Briefcase, GraduationCap, FileText, Star } from 'lucide-react';

interface ExperienceItemProps {
  title: string;
  company: string;
  date: string;
  description: string[];
  link?: string;
  type?: 'work' | 'education';
  location?: string;
  skills?: string[];
}

const ExperienceItem: React.FC<ExperienceItemProps & { index: number }> = ({ 
  title, 
  company, 
  date, 
  description,
  link,
  type = 'work',
  location,
  skills = [],
  index
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => {
      if (itemRef.current) observer.unobserve(itemRef.current);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
    }
  };

  return (
    <div 
      ref={itemRef}
      className="opacity-0"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div 
        className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700/50 overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transform: isHovered 
            ? `perspective(1000px) rotateX(${(mousePosition.y - 0.5) * 2}deg) rotateY(${(mousePosition.x - 0.5) * 2}deg) translateZ(10px)`
            : 'none',
          transition: 'transform 0.3s ease-out, box-shadow 0.3s ease'
        }}
      >
        {/* Subtle hover effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            backgroundPosition: `${mousePosition.x * 100}% ${mousePosition.y * 100}%`
          }}
        />
        
        {/* Timeline indicator */}
        <div className="absolute left-0 top-8 w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-r-full" />

        {/* Content */}
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {title}
              </h3>
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                {type === 'work' ? <Briefcase size={16} /> : <GraduationCap size={16} />}
                <span className="font-medium">{company}</span>
              </div>
            </div>
            
            <div className="flex-shrink-0 flex items-center gap-2">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                type === 'work' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
              }`}>
                {type === 'work' ? 'Expérience' : 'Formation'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              {date}
            </div>
            {location && (
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                {location}
              </div>
            )}
          </div>

          <div className="space-y-2">
            {description.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <ChevronRight className="flex-shrink-0 mt-1 text-purple-500" size={14} />
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>

          {skills.length > 0 && (
            <div className="pt-2">
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <span 
                    key={idx} 
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md border border-gray-200 dark:border-gray-600 transition-all group-hover:bg-purple-50 group-hover:border-purple-200 group-hover:text-purple-700 dark:group-hover:bg-purple-900/30 dark:group-hover:border-purple-700 dark:group-hover:text-purple-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {link && (
            <div className="pt-2">
              <a 
                href={link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
              >
                <span>Voir le projet</span>
                <ExternalLink size={14} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ReferenceCard: React.FC<{ name: string; position: string; contact: string; index: number }> = ({ 
  name, position, contact, index 
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, []);

  return (
    <div 
      ref={cardRef}
      className="opacity-0 group relative bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700/50"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-sm">
            <Users className="text-white" size={16} />
          </div>
        </div>
        <div className="flex-1 space-y-1">
          <h4 className="font-bold text-gray-900 dark:text-white">{name}</h4>
          <p className="text-purple-600 dark:text-purple-400 text-sm">{position}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{contact}</p>
        </div>
        <Star className="text-yellow-400 opacity-80 group-hover:opacity-100 transition-opacity" size={16} />
      </div>
    </div>
  );
};

const Experience: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'experience' | 'education'>('experience');

  const experienceData: (ExperienceItemProps & { skills: string[] })[] = [
    {
      title: "Stage - Développeuse Web Full Stack",
      company: "Accent Media",
      date: "Novembre 2023 - Mai 2024 (6 mois)",
      location: "Douala, Cameroun",
      description: [
        "Conception et développement complet du site web pour la Caisse des Dépôts et Consignations du Cameroun",
        "Architecture moderne avec séparation frontend/backend et déploiement containerisé",
        "Interface utilisateur responsive et optimisée pour l'accessibilité"
      ],
      skills: ["Laravel", "Vue.js 3", "Tailwind CSS", "Docker", "MySQL"],
      link: "https://cdec.cm"
    },
    {
      title: "Développeuse Web Full Stack",
      company: "DA VINCI IT SOLUTIONS",
      date: "Mai 2023 - Novembre 2023 (6 mois)",
      location: "Remote",
      description: [
        "Développement d'une application blog avec système d'authentification et gestion de contenu",
        "Création d'une application de gestion de dépenses avec tableaux de bord analytiques",
        "Mise en place d'APIs RESTful et intégration de bases de données NoSQL"
      ],
      skills: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT"],
      link: "https://davinci-blog.onrender.com"
    },
    {
      title: "Développeuse Web Frontend",
      company: "GENO CONSULTING",
      date: "2022 - 2023",
      location: "Yaoundé, Cameroun",
      description: [
        "Participation au développement de la plateforme sociale AfricaUnity",
        "Intégration d'interfaces utilisateur modernes et responsives",
        "Collaboration avec l'équipe backend pour l'intégration des APIs"
      ],
      skills: ["React.js", "Tailwind CSS", "JavaScript", "Git"],
      link: "https://africaunity.net"
    },
    {
      title: "Testeuse QA Web",
      company: "ADAA",
      date: "2021 - 2022",
      location: "Remote",
      description: [
        "Tests fonctionnels approfondis sur les plateformes jobs.adaalearning.com et adaasummit.com",
        "Rédaction de rapports de bugs détaillés et suivi des corrections",
        "Validation de l'expérience utilisateur sur différents navigateurs et appareils"
      ],
      skills: []
    },
    {
      title: "Développeuse Web Laravel",
      company: "CENTRE MÉDICAL LA LIFE",
      date: "2021 (3 mois)",
      location: "Douala, Cameroun",
      description: [
        "Développement d'une application de gestion de pointage du personnel",
        "Interface d'administration avec tableaux de bord temps réel",
        "Système de notifications et reporting automatisé"
      ],
      skills: ["Laravel", "Livewire", "Tailwind CSS", "MySQL"]
    }
  ];

  const educationData: ExperienceItemProps[] = [
    {
      title: "Licence Professionnelle MIAW",
      company: "UIT d'Évry Val d'Essonne - INUBIL, ISTAMA Douala",
      date: "2023 - 2024",
      location: "Douala, Cameroun",
      description: [
        "Métiers de l'Informatique et des Applications Web",
        "Spécialisation en développement web moderne et technologies cloud",
        "Projet de fin d'études : Plateforme e-learning avec Laravel et Vue.js"
      ],
      type: 'education'
    },
    {
      title: "BTS Génie Logiciel",
      company: "ISTAMA - Institut Supérieur de Technologie et de Management",
      date: "2018 - 2019",
      location: "Douala, Cameroun", 
      description: [
        "Formation complète en développement de logiciels et applications",
        "Algorithmique, structures de données et programmation orientée objet",
        "Projet final : Application de gestion de bibliothèque en Java"
      ],
      type: 'education'
    }
  ];

  const references = [
    { name: "Mr. Brice NGUEMO", position: "Chef Technique ADAA", contact: "+237 9506 3382" },
    { name: "Dr. ACHILE FOGANG", position: "Directeur Centre médical la Life", contact: "+237 6570 80409" },
    { name: "Mr. HABIB", position: "Chef du département IT chez Accent Media", contact: "+237 7822 5479" }
  ];

  return (
    <section id="experience" className="relative py-16 lg:py-24 bg-gray-50 dark:bg-gray-950">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-[0.02]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmaWxsPSJub25lIiBzdHJva2U9IiM3ODVjZWIiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2Utb3BhY2l0eT0iMC4zIj48cGF0aCBkPSJNMCAwaDQwNDAiLz48L3N2Zz4=')]" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-medium mb-4">
            <Award className="mr-1.5" size={14} />
            Parcours Professionnel
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Expériences & Formation
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Un parcours riche en apprentissages, défis techniques et collaborations inspirantes.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm border border-gray-100 dark:border-gray-700/50">
            <button
              onClick={() => setActiveTab('experience')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'experience'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
              }`}
            >
              <Briefcase size={16} />
              Expériences
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'education'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
              }`}
            >
              <GraduationCap size={16} />
              Formation
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative">
          {/* Timeline line - only visible on larger screens */}
          <div className="absolute left-0 lg:left-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-600 to-transparent hidden sm:block" />
          
          <div className="space-y-4 sm:space-y-6 sm:ml-8">
            {activeTab === 'experience' ? (
              experienceData.map((experience, index) => (
                <ExperienceItem key={index} {...experience} index={index} />
              ))
            ) : (
              educationData.map((education, index) => (
                <ExperienceItem key={index} {...education} index={index} />
              ))
            )}
          </div>
        </div>

        {/* References Section */}
        <div className="mt-16 lg:mt-24">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium mb-4">
              <FileText className="mr-1.5" size={14} />
              Références
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Recommandations
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm max-w-xl mx-auto">
              Professionnels avec qui j'ai collaboré
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {references.map((ref, index) => (
              <ReferenceCard key={index} {...ref} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;