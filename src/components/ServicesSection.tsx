"use client";

import { services } from "@/data/portfolio";
import { motion } from "framer-motion";
import TiltCard from "./TiltCard";

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 border-t border-border/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sm uppercase font-bold tracking-widest text-center text-muted-foreground mb-4">
          What I Do
        </p>
        <h2 className="text-center lg:text-4xl text-3xl font-bold mb-12">
          My <span className="text-primary">Services</span>
        </h2>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {services.map((service, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            style={{ perspective: 1000 }}
          >
            <TiltCard className="h-full group p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors shadow-sm hover:shadow-md">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <span className="group-hover:grayscale-0">{service.icon}</span>
              </div>
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
