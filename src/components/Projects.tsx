
import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ExternalLink, Code, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface ProjectProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  githubLink?: string;
}

const Project: React.FC<ProjectProps> = ({ title, description, image, tags, link, githubLink }) => {
  const projectRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.2,
      }
    );

    if (projectRef.current) {
      observer.observe(projectRef.current);
    }

    return () => {
      if (projectRef.current) observer.unobserve(projectRef.current);
    };
  }, []);

  return (
    <Card 
      ref={projectRef} 
      className="project-card animated-element overflow-hidden group border-gray-200 dark:border-gray-800 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-52 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, index) => (
            <span 
              key={index} 
              className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full text-xs whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0 border-t border-gray-100 dark:border-gray-800">
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-1 text-portfolio-purple hover:underline text-sm font-medium"
        >
          <Eye size={16} />
          Voir le site
        </a>
        
        {githubLink && (
          <a 
            href={githubLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-portfolio-purple text-sm"
          >
            <Code size={16} />
            Source
          </a>
        )}
      </CardFooter>
      
      {/* Overlay effect on hover */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-portfolio-dark/80 via-transparent to-transparent flex items-end transition-opacity duration-300 p-6 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="text-white w-full">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center text-white hover:text-portfolio-purple transition-colors"
          >
            Visiter le projet <ExternalLink size={16} className="ml-2" />
          </a>
        </div>
      </div>
    </Card>
  );
};

const Projects: React.FC = () => {
  const projects: ProjectProps[] = [
    {
      title: "CDEC - Caisse des Dépôts du Cameroun",
      description: "Site web développé pour la Caisse des Dépôts et Consignations du Cameroun avec Laravel, Vue.js et Tailwind.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3",
      tags: ["Laravel", "Vue.js", "Tailwind CSS", "Docker"],
      link: "https://cdec.cm",
      githubLink: "https://github.com/yohivana-KYIM"
    },
    {
      title: "Blog Tech",
      description: "Application de blog avec système de publication d'articles et commentaires.",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3",
      tags: ["React.js", "Node.js", "MongoDB"],
      link: "https://davinci-blog.onrender.com",
      githubLink: "https://github.com/yohivana-KYIM"
    },
    {
      title: "Gestion des Dépenses",
      description: "Application de suivi et gestion des dépenses personnelles.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3",
      tags: ["React", "MongoDB", "Express", "Node.js"],
      link: "https://expense-davincit.vercel.app",
      githubLink: "https://github.com/yohivana-KYIM"
    },
    {
      title: "Africa Unity",
      description: "Plateforme de mise en réseau pour les professionnels africains.",
      image: "https://images.unsplash.com/photo-1526082983696-949ca3e1a81a?ixlib=rb-4.0.3",
      tags: ["PHP", "Laravel", "Vue.js"],
      link: "https://africaunity.net"
    },
    {
      title: "Eco Clean Promax",
      description: "Site web pour une entreprise de nettoyage avec blog intégré.",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3",
      tags: ["React", "Next.js", "Tailwind CSS"],
      link: "https://eco-clean-promax.vercel.app/blog/hygiene-domestique-bien-etre"
    },
    {
      title: "Locato Landing Page",
      description: "Page d'accueil pour une application de location immobilière.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3",
      tags: ["HTML", "CSS", "JavaScript", "Responsive Design"],
      link: "https://locato-landingpage-v1.vercel.app"
    },
  ];

  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Start animating the cards when section is visible
          const cards = document.querySelectorAll('.project-card');
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('visible');
            }, 100 * index);
          });
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section id="projects" className="py-20 relative" ref={sectionRef}>
      <div className="section-container">
        <h2 className="section-title notion-fade-in">Mes Projets</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {projects.map((project, index) => (
            <Project key={index} {...project} />
          ))}
        </div>
        
        <div className="text-center mt-16 notion-fade-in">
          <a 
            href="https://github.com/yohivana-KYIM" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center px-8 py-3 bg-portfolio-purple text-white rounded-full hover:bg-opacity-90 transition-all duration-300 shadow-lg hover-button"
          >
            Voir plus sur GitHub <ArrowRight size={16} className="ml-2" />
          </a>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -z-10 w-64 h-64 bg-portfolio-purple/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-80 h-80 bg-portfolio-green/5 rounded-full blur-3xl"></div>
    </section>
  );
};

export default Projects;
