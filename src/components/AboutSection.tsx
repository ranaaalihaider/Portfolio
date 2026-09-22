"use client";

import { personalInfo } from "@/data/portfolio";
import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 border-t border-border/50">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm uppercase font-bold tracking-widest text-center text-muted-foreground mb-4">
            Discover
          </p>
          <h2 className="text-center lg:text-4xl text-3xl font-bold mb-10">
            About <span className="text-primary">Me</span>
          </h2>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card p-8 md:p-10 rounded-2xl border border-border shadow-sm"
        >
          <div className="space-y-6 text-foreground/80 leading-relaxed text-lg">
            {personalInfo.about.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-border">
            <div>
              <h3 className="font-bold text-lg mb-2">Education</h3>
              <p className="font-medium">{personalInfo.degree}</p>
              <p className="text-muted-foreground">{personalInfo.university}</p>
              <p className="text-sm text-primary mt-1">{personalInfo.studyPeriod}</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Location</h3>
              <p className="font-medium">{personalInfo.location}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
