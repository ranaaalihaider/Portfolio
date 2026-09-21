import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import ExperienceSection from "@/components/ExperienceSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import ParticlesBackground from "@/components/ParticlesBackground";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <ParticlesBackground />
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10 space-y-20 pb-20">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ExperienceSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      
      <footer className="border-t border-border/50 py-8 bg-card relative z-10">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Ali Haider. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
