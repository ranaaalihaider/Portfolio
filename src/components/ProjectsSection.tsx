"use client";

import { projects } from "@/data/portfolio";
import { ExternalLink, Folder } from "lucide-react";
import { FaGithub as Github } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import TiltCard from "./TiltCard";
import ScreenshotsModal from "./ScreenshotsModal";
import { useState, useMemo } from "react";

const CATEGORIES = ["All", "Web & SaaS", "AI & Analytics", "Java / Desktop"];

export default function ProjectsSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<typeof projects[0] | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const handleOpenScreenshots = (project: typeof projects[0]) => {
    setActiveProject(project);
    setModalOpen(true);
  };

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") return projects;
    
    return projects.filter((project) => {
      const techString = project.technologies.join(" ").toLowerCase();
      if (activeCategory === "Web & SaaS") {
        return techString.includes("node") || techString.includes("php") || techString.includes("laravel") || project.technologies.length === 0;
      }
      if (activeCategory === "AI & Analytics") {
        return techString.includes("python") || techString.includes("ai");
      }
      if (activeCategory === "Java / Desktop") {
        return techString.includes("java");
      }
      return true;
    });
  }, [activeCategory]);

  return (
    <section id="projects" className="py-20 border-t border-border/50">
      <div className="max-w-6xl mx-auto px-4 md:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm uppercase font-bold tracking-widest text-center text-muted-foreground mb-4">
            Portfolio
          </p>
          <h2 className="text-center lg:text-4xl text-3xl font-bold mb-10">
            Featured <span className="text-primary">Projects</span>
          </h2>
        </motion.div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeCategory === category 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div 
                layout
                key={project.id} 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
                style={{ perspective: 1000 }}
                className="h-full"
              >
                <TiltCard className="h-full group rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col">
                  {/* Project Image/Preview */}
                  <div className="relative aspect-video w-full bg-muted/30 overflow-hidden shrink-0 border-b border-border/50">
                    {project.screenshots && project.screenshots.length > 0 ? (
                      <img 
                        src={project.screenshots[0]} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Folder className="w-16 h-16 text-muted-foreground/30 transition-transform duration-700 group-hover:scale-110 group-hover:text-primary/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-500" />
                    
                    {/* Floating Type Badge */}
                    <div className="absolute top-4 right-4 backdrop-blur-md bg-background/70 border border-border/50 text-primary px-3 py-1 rounded-full text-xs font-semibold shadow-sm max-w-[80%] truncate">
                      {project.type}
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="p-6 flex flex-col grow">
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{project.title}</h3>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
                      {project.description}
                    </p>

                    <div className="mt-auto">
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.technologies.length > 0 ? project.technologies.slice(0, 4).map((tech, i) => (
                          <span key={i} className="text-[11px] font-medium px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
                            {tech}
                          </span>
                        )) : (
                           <span className="text-[11px] font-medium px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">Various</span>
                        )}
                        {project.technologies.length > 4 && (
                          <span className="text-[11px] font-medium px-2 py-1 rounded-md bg-muted text-muted-foreground border border-border">
                            +{project.technologies.length - 4}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                        {project.screenshots && project.screenshots.length > 0 && (
                          <button 
                            onClick={() => handleOpenScreenshots(project)}
                            className="flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors cursor-pointer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                            Screenshots
                          </button>
                        )}
                        {project.github && (
                          <a 
                            href={project.github} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors"
                          >
                            <Github className="w-4 h-4" />
                            Code
                          </a>
                        )}
                        {project.link && (
                          <a 
                            href={project.link} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <ScreenshotsModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        screenshots={activeProject?.screenshots || []} 
        projectTitle={activeProject?.title || ""} 
      />
    </section>
  );
}
