"use client";

import { skills } from "@/data/portfolio";
import { motion } from "framer-motion";
import { 
  Code2, 
  Server, 
  Database, 
  Smartphone, 
  Bot, 
  Wrench 
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Frontend: Code2,
  Backend: Server,
  Databases: Database,
  MobileDevelopment: Smartphone,
  ProgrammingLanguages: Code2,
  AIML: Bot,
  ToolsPlatforms: Wrench,
};

const planets = [
  { id: "Frontend", radius: 160, angle: 0, duration: 40 },
  { id: "Backend", radius: 160, angle: 180, duration: 40 },
  
  { id: "Databases", radius: 280, angle: 0, duration: 60 },
  { id: "MobileDevelopment", radius: 280, angle: 120, duration: 60 },
  { id: "ToolsPlatforms", radius: 280, angle: 240, duration: 60 },
  
  { id: "ProgrammingLanguages", radius: 400, angle: 90, duration: 80 },
  { id: "AIML", radius: 400, angle: 270, duration: 80 },
];

export default function SkillsSection() {
  return (
    <section id="skills" className="py-24 border-t border-border/50 relative overflow-hidden bg-background">
      {/* Deep Space Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <p className="text-sm uppercase font-bold tracking-widest text-primary mb-2">
            The Skill Universe
          </p>
          <h2 className="lg:text-5xl text-4xl font-black tracking-tight">
            Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-300">Ecosystem</span>
          </h2>
        </motion.div>
        
        {/* === DESKTOP SOLAR SYSTEM === */}
        <div className="hidden lg:flex relative w-full h-[900px] items-center justify-center overflow-visible">
          
          {/* Orbital Rings */}
          <div className="absolute w-[320px] h-[320px] rounded-full border border-primary/20 border-dashed" />
          <div className="absolute w-[560px] h-[560px] rounded-full border border-primary/10 border-dashed" />
          <div className="absolute w-[800px] h-[800px] rounded-full border border-primary/5 border-dashed" />

          {/* Core (Sun) */}
          <div className="absolute z-20 flex flex-col items-center justify-center w-32 h-32 bg-card rounded-full border-4 border-primary shadow-[0_0_50px_rgba(var(--primary),0.5)]">
            <span className="font-black text-xl text-primary">CORE</span>
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-20" />
          </div>

          {/* Planets */}
          {planets.map((planet) => {
            const Icon = iconMap[planet.id] || Wrench;
            const categorySkills = skills[planet.id as keyof typeof skills];
            const formattedCategory = planet.id.replace(/([A-Z])/g, ' $1').trim();

            return (
              <motion.div
                key={planet.id}
                className="absolute top-1/2 left-1/2 w-0 h-0 z-30"
                animate={{ rotate: [planet.angle, planet.angle + 360] }}
                transition={{ repeat: Infinity, duration: planet.duration, ease: "linear" }}
              >
                {/* Positioned on the orbital path */}
                <div 
                  className="absolute" 
                  style={{ top: -planet.radius, left: 0 }}
                >
                  {/* Counter-rotation to keep content upright */}
                  <motion.div
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    animate={{ rotate: [-planet.angle, -planet.angle - 360] }}
                    transition={{ repeat: Infinity, duration: planet.duration, ease: "linear" }}
                  >
                    <div className="group relative flex items-center justify-center">
                      
                      {/* The Planet Pill */}
                      <div className="px-5 py-3 rounded-full bg-card/90 backdrop-blur-xl border border-primary/40 shadow-[0_0_20px_rgba(var(--primary),0.1)] flex items-center gap-3 cursor-crosshair group-hover:border-primary group-hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all duration-300 z-10 whitespace-nowrap">
                        <Icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300 shrink-0" />
                        <span className="font-bold text-sm tracking-wide text-foreground shrink-0">{formattedCategory}</span>
                        <div className="hidden md:flex gap-1.5 ml-2 border-l border-border/50 pl-3 items-center">
                          {categorySkills.slice(0, 2).map((skill, i) => (
                            <span key={i} className="text-[10px] uppercase font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-sm">
                              {skill}
                            </span>
                          ))}
                          {categorySkills.length > 2 && <span className="text-[10px] font-bold text-primary px-1 py-0.5">+{categorySkills.length - 2}</span>}
                        </div>
                      </div>

                      {/* Expansion Panel (Appears on Hover) */}
                      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 translate-x-8 w-72 bg-card/95 backdrop-blur-3xl border border-primary/50 rounded-2xl p-6 opacity-0 scale-90 origin-left group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none z-50">
                        <h4 className="font-bold text-xl mb-4 text-foreground capitalize tracking-tight flex items-center gap-3">
                          <Icon className="w-5 h-5 text-primary" />
                          {formattedCategory}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {categorySkills.map((skill, skillIndex) => (
                            <span 
                              key={skillIndex} 
                              className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 text-xs font-semibold rounded-md"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* === MOBILE FALLBACK (Cards) === */}
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
          {planets.map((planet) => {
            const Icon = iconMap[planet.id] || Wrench;
            const categorySkills = skills[planet.id as keyof typeof skills];
            const formattedCategory = planet.id.replace(/([A-Z])/g, ' $1').trim();

            return (
              <div key={planet.id} className="bg-card/60 backdrop-blur-xl rounded-3xl p-6 border border-border/50 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold capitalize">{formattedCategory}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categorySkills.map((skill, skillIndex) => (
                    <span 
                      key={skillIndex} 
                      className="px-3 py-1.5 bg-background border border-border/50 text-foreground text-sm font-semibold rounded-lg shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Infinite Marquee Ticker */}
      <div className="relative mt-24 w-full flex overflow-hidden border-y border-border/20 bg-muted/20 py-6">
        <motion.div 
          className="flex whitespace-nowrap gap-12 px-4 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 50,
              ease: "linear",
            },
          }}
        >
          {[...Object.values(skills).flat(), ...Object.values(skills).flat()].map((skill, idx) => (
            <div key={idx} className="flex items-center gap-12">
              <span className="text-2xl md:text-4xl font-black text-transparent hover:text-primary transition-colors duration-300 cursor-default" style={{ WebkitTextStroke: "1.5px rgba(148, 163, 184, 0.4)" }}>
                {skill.toUpperCase()}
              </span>
              <span className="text-primary/40 text-2xl">•</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
