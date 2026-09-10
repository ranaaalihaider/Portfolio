import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { FeaturedProject } from "@/components/sections/FeaturedProject";
import { Projects } from "@/components/sections/Projects";
import { Education } from "@/components/sections/Education";
import { DeveloperActivity } from "@/components/sections/DeveloperActivity";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <Skills />
        <FeaturedProject />
        <Projects />
        <Education />
        <DeveloperActivity />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
