import { Mail, Phone, ChevronRight, Download } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import ParticlesBackground from "@/components/ParticlesBackground";
import ProjectsSection from "@/components/ProjectsSection";
import { personalInfo, timeline, skills, services } from "@/data/portfolio";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <ParticlesBackground />
      
      {/* Navigation */}
      <nav className="glass fixed top-0 z-50 w-full px-6 py-4 border-b border-white/5">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between">
          <span className="text-xl font-bold tracking-tighter">{personalInfo.name}</span>
          
          <div className="hidden space-x-8 md:flex">
            <a href="#about" className="text-sm font-medium hover:text-primary-500 transition-colors">About</a>
            <a href="#timeline" className="text-sm font-medium hover:text-primary-500 transition-colors">Experience</a>
            <a href="#projects" className="text-sm font-medium hover:text-primary-500 transition-colors">Projects</a>
            <a href="#contact" className="text-sm font-medium hover:text-primary-500 transition-colors">Contact</a>
          </div>

          <a 
            href="/cv.pdf" 
            download="Ali_Haider_CV.pdf"
            className="flex items-center gap-2 rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-700 hover:scale-105"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Resume</span>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative mx-auto flex min-h-screen w-full max-w-[1600px] flex-col justify-center px-6 md:px-12 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-12 items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 zoom-in-95">
          
          {/* Profile Image - Left Side */}
          <div className="relative mx-auto md:mx-0 w-64 h-64 md:w-80 md:h-80 flex-shrink-0">
            {/* Glowing background blob */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary-500 via-purple-500 to-cyan-500 blur-2xl opacity-40 animate-pulse"></div>
            
            {/* Professional border and image */}
            <div className="absolute inset-0 rounded-full border-4 border-white/10 p-2 shadow-2xl shadow-primary-500/20">
              <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-primary-500/50 bg-black">
                <Image
                  src="/Profile.png"
                  alt={personalInfo.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  priority
                />
              </div>
            </div>
          </div>
          
          {/* Content - Right Side */}
          <div className="text-center md:text-left">
            <h2 className="mb-2 text-lg font-medium text-primary-500 md:text-xl">
              Hi, I am
            </h2>
            <h1 className="mb-4 text-5xl font-extrabold tracking-tight md:text-7xl lg:text-8xl">
              {personalInfo.name}.
            </h1>
            <h3 className="mb-6 text-2xl font-bold text-foreground/80 md:text-4xl lg:text-5xl">
              {personalInfo.taglines[0]}
            </h3>
            <p className="mb-10 text-lg text-foreground/60 md:text-xl max-w-2xl mx-auto md:mx-0">
              {personalInfo.shortIntro}
            </p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <a 
                href="#projects" 
                className="flex items-center gap-2 rounded-full bg-primary-600 px-8 py-4 font-semibold text-white transition-all hover:bg-primary-700 hover:scale-105 shadow-lg shadow-primary-600/30"
              >
                View My Work
                <ChevronRight size={20} />
              </a>
              <div className="flex items-center gap-4 px-4">
                <Link href={personalInfo.github} target="_blank" className="p-2 text-foreground/60 transition-colors hover:text-foreground">
                  <FaGithub size={24} />
                </Link>
                <Link href={personalInfo.linkedin} target="_blank" className="p-2 text-foreground/60 transition-colors hover:text-foreground">
                  <FaLinkedin size={24} />
                </Link>
                <Link href={`mailto:${personalInfo.email}`} className="p-2 text-foreground/60 transition-colors hover:text-foreground">
                  <Mail size={24} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT, JOURNEY & SKILLS (Combined Parallel Section) ── */}
      <section id="about" className="mx-auto w-full max-w-[1600px] px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Column 1: About Me */}
          <div className="flex flex-col gap-4">
            <div className="mb-2">
              <h2 className="text-3xl font-bold">About Me</h2>
              <div className="mt-2 h-1 w-20 rounded bg-primary-500"></div>
            </div>
            
            <div className="glass rounded-2xl p-6 relative overflow-hidden group border border-white/10">
              <div className="absolute right-0 top-0 w-32 h-32 bg-primary-500/10 blur-3xl rounded-full pointer-events-none"></div>
              <div className="space-y-4 text-sm text-foreground/80 max-h-[300px] overflow-y-auto pr-4 no-scrollbar relative z-10">
                {personalInfo.about.map((paragraph, index) => (
                  <p key={index} className="leading-relaxed">{paragraph}</p>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background/90 via-background/40 to-transparent pointer-events-none rounded-b-2xl z-20"></div>
            </div>

            <div className="glass rounded-2xl p-6 relative overflow-hidden border border-white/10 mt-2">
              <h3 className="mb-4 text-xl font-bold">Quick Facts</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="flex items-center justify-center rounded-full bg-primary-500/20 w-8 h-8 text-primary-500 flex-shrink-0"><span className="text-sm">📚</span></div>
                  <div>
                    <h4 className="font-bold text-sm">Education</h4>
                    <p className="text-foreground/70 text-xs mt-0.5">{personalInfo.degree}</p>
                    <p className="text-foreground/50 text-[10px] mt-0.5">{personalInfo.university} ({personalInfo.studyPeriod})</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex items-center justify-center rounded-full bg-primary-500/20 w-8 h-8 text-primary-500 flex-shrink-0"><span className="text-sm">📍</span></div>
                  <div>
                    <h4 className="font-bold text-sm">Location</h4>
                    <p className="text-foreground/70 text-xs mt-0.5">{personalInfo.location}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 2: My Journey */}
          <div className="flex flex-col gap-4">
            <div className="mb-2 mt-8 lg:mt-0">
              <h2 className="text-3xl font-bold">My Journey</h2>
              <div className="mt-2 h-1 w-20 rounded bg-primary-500"></div>
            </div>
            
            <div className="glass rounded-2xl p-6 border border-white/10 h-full">
              <div className="relative border-l border-primary-500/30 pl-6 space-y-8 py-2">
                {timeline.map((item, index) => (
                  <div key={item.year} className="relative group">
                    <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-background border-2 border-primary-500 group-hover:bg-primary-500 transition-colors shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    <span className="text-[10px] font-black tracking-widest text-primary-500 mb-1 block uppercase">{item.year}</span>
                    <h3 className="text-sm font-bold mb-1.5 text-white">{item.title}</h3>
                    <p className="text-xs text-foreground/70 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: What I Do & Skills */}
          <div className="flex flex-col gap-4">
            <div className="mb-2 mt-8 lg:mt-0">
              <h2 className="text-3xl font-bold">What I Do</h2>
              <div className="mt-2 h-1 w-20 rounded bg-primary-500"></div>
            </div>
            
            <div className="glass rounded-2xl p-6 border border-white/10">
              <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 no-scrollbar">
                {services.map((service, index) => (
                  <div key={index} className="border-b border-border/20 pb-4 last:border-0 last:pb-0 group">
                    <h3 className="text-sm font-bold mb-1.5 group-hover:text-primary-400 transition-colors flex items-center gap-2">
                      <span>{service.icon}</span> {service.title}
                    </h3>
                    <p className="text-xs text-foreground/70 leading-relaxed">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-6 border border-white/10 mt-2">
              <h3 className="mb-4 text-xl font-bold">Technologies</h3>
              <div className="space-y-4 max-h-[160px] overflow-y-auto pr-2 no-scrollbar">
                {Object.entries(skills).map(([category, items]) => (
                  <div key={category}>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-primary-500 mb-2">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((skill) => (
                        <span key={skill} className="bg-primary-500/10 border border-primary-500/20 rounded-full px-2 py-0.5 text-[10px] font-medium text-primary-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Projects Section */}
      <ProjectsSection />

      {/* Contact Section */}
      <section id="contact" className="mx-auto w-full max-w-[1600px] px-6 md:px-12 py-12 text-center">
        <h2 className="text-4xl font-bold md:text-6xl mb-6">Let's Work Together</h2>
        <p className="text-xl text-foreground/70 mb-10">
          Have a project, collaboration opportunity, internship, freelance work, or an interesting software idea? Feel free to get in touch.
        </p>
        
        <a 
          href={`mailto:${personalInfo.email}`}
          className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-primary-700 hover:scale-105 hover:shadow-xl hover:shadow-primary-600/30"
        >
          <Mail size={24} />
          Say Hello
        </a>
        
        <div className="mt-16 flex justify-center gap-6">
          <a href={personalInfo.github} target="_blank" className="p-3 rounded-full glass hover:bg-primary-500/20 transition-all hover:-translate-y-1">
            <FaGithub size={24} />
          </a>
          <a href={personalInfo.linkedin} target="_blank" className="p-3 rounded-full glass hover:bg-primary-500/20 transition-all hover:-translate-y-1">
            <FaLinkedin size={24} />
          </a>
          <a href={`tel:${personalInfo.phone.replace(/\\s/g, '')}`} className="p-3 rounded-full glass hover:bg-primary-500/20 transition-all hover:-translate-y-1">
            <Phone size={24} />
          </a>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-border/50 py-8 text-center text-sm text-foreground/50">
        <p>© {new Date().getFullYear()} {personalInfo.name}. All rights reserved.</p>
        <p className="mt-1">Built with React & Next.js</p>
      </footer>
    </main>
  );
}
