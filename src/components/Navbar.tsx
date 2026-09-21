"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { personalInfo } from "@/data/portfolio";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="flex justify-between items-center py-5 container mx-auto px-4 md:px-8">
        <a className="text-2xl font-bold tracking-tighter" href="/">
          <span className="text-primary">A</span>li <span className="text-primary">H</span>aider
        </a>
        <nav className="hidden lg:flex items-center space-x-6">
          <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">About</a>
          <a href="#experience" className="text-sm font-medium hover:text-primary transition-colors">Experience</a>
          <a href="#skills" className="text-sm font-medium hover:text-primary transition-colors">Skills</a>
          <a href="#projects" className="text-sm font-medium hover:text-primary transition-colors">Projects</a>
          <a href="#services" className="text-sm font-medium hover:text-primary transition-colors">Services</a>
          <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</a>
          <a 
            href={`https://wa.me/${personalInfo.phone.replace(/[^0-9]/g, '')}?text=Hey%20Ali%20Haider%20we%20want%20to%20hire%20you`}
            target="_blank"
            rel="noreferrer"
            className="bg-primary text-primary-foreground hover:bg-transparent hover:text-primary border border-primary transition-all duration-300 px-6 py-2 rounded-md font-semibold text-sm"
          >
            Hire Me
          </a>
        </nav>
        <div className="lg:hidden flex">
          <button onClick={toggleMenu} aria-label="Toggle Menu">
            {isOpen ? <X className="text-primary w-6 h-6" /> : <Menu className="text-primary w-6 h-6" />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-card border-b border-white/5 shadow-xl p-4 flex flex-col space-y-4">
          <a href="#about" onClick={toggleMenu} className="text-sm font-medium hover:text-primary transition-colors">About</a>
          <a href="#experience" onClick={toggleMenu} className="text-sm font-medium hover:text-primary transition-colors">Experience</a>
          <a href="#skills" onClick={toggleMenu} className="text-sm font-medium hover:text-primary transition-colors">Skills</a>
          <a href="#projects" onClick={toggleMenu} className="text-sm font-medium hover:text-primary transition-colors">Projects</a>
          <a href="#services" onClick={toggleMenu} className="text-sm font-medium hover:text-primary transition-colors">Services</a>
          <a href="#contact" onClick={toggleMenu} className="text-sm font-medium hover:text-primary transition-colors">Contact</a>
        </div>
      )}
    </div>
  );
}
