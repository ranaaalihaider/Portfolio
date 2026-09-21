"use client";

import { personalInfo } from "@/data/portfolio";
import { Calendar, FileText, Mail } from "lucide-react";
import { FaGithub as Github, FaLinkedin as Linkedin, FaWhatsapp as Whatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="grid lg:grid-cols-2 grid-cols-1 items-center lg:text-left text-center min-h-[90vh] py-10" id="home">
      <motion.header 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:order-2 order-2 lg:my-0 my-10 space-y-6"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm w-fit mx-auto lg:mx-0"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-muted-foreground font-medium">Available for projects & opportunities</span>
        </motion.div>
        
        <div className="flex flex-col gap-2">
          <span className="text-primary font-semibold text-lg">Hi, I am</span>
          <h1 className="lg:text-[5.5rem] text-6xl font-black tracking-tighter text-foreground leading-none">
            {personalInfo.name}.
          </h1>
        </div>
        
        <h2 className="lg:text-4xl text-3xl font-bold tracking-tight text-foreground/90 leading-[1.2] max-w-2xl lg:mx-0 mx-auto">
          {personalInfo.role}
        </h2>
        
        <p className="lg:text-lg text-base text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
          {personalInfo.shortIntro}
        </p>

        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm md:text-base py-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary text-xl">3+</span>
            <span className="text-muted-foreground font-medium">Years Experience</span>
            <span className="text-muted-foreground/30 hidden md:inline ml-2">|</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary text-xl">10+</span>
            <span className="text-muted-foreground font-medium">Projects Shipped</span>
            <span className="text-muted-foreground/30 hidden md:inline ml-2">|</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary text-xl">100%</span>
            <span className="text-muted-foreground font-medium">Commitment</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
          <a
            href={`https://wa.me/${personalInfo.phone.replace(/[^0-9]/g, '')}?text=Hey%20Ali%20Haider%20we%20want%20to%20hire%20you`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-semibold bg-primary text-primary-foreground hover:bg-transparent hover:text-primary border border-primary transition-all duration-300 h-12 px-8 shadow-lg shadow-primary/20 hover:shadow-none"
          >
            <Whatsapp className="mr-2 h-5 w-5" />
            Let's Talk
          </a>
          <a
            href="/cv.pdf"
            download="Ali_Haider_Resume.pdf"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-semibold bg-transparent border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 h-12 px-8"
          >
            <FileText className="mr-2 h-4 w-4" />
            Download Resume
          </a>
        </div>

        <ul className="flex justify-center lg:justify-start space-x-4 pt-6">
          <li>
            <a href={personalInfo.github} target="_blank" rel="noreferrer" className="block p-3 rounded-md bg-muted/50 text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:-translate-y-1">
              <Github className="w-5 h-5" />
            </a>
          </li>
          <li>
            <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="block p-3 rounded-md bg-muted/50 text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:-translate-y-1">
              <Linkedin className="w-5 h-5" />
            </a>
          </li>
          <li>
            <a href={`mailto:${personalInfo.email}`} className="block p-3 rounded-md bg-muted/50 text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:-translate-y-1">
              <Mail className="w-5 h-5" />
            </a>
          </li>
        </ul>
      </motion.header>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="lg:order-1 order-1 flex justify-center lg:justify-start relative"
      >
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-primary/20 p-2">
          <div className="w-full h-full bg-muted rounded-full overflow-hidden relative">
            <img 
              src="/Profile.png" 
              alt={personalInfo.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null; // Prevent infinite loops
                target.src = "https://ui-avatars.com/api/?name=Ali+Haider&size=512&background=3b82f6&color=fff";
              }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
