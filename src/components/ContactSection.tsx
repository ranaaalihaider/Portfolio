"use client";

import { personalInfo } from "@/data/portfolio";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaGithub as Github, FaLinkedin as Linkedin, FaWhatsapp as Whatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 border-t border-border/50">
      <div className="max-w-4xl mx-auto px-4 md:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm uppercase font-bold tracking-widest text-center text-muted-foreground mb-4">
            Get In Touch
          </p>
          <h2 className="text-center lg:text-4xl text-3xl font-bold mb-16">
            Contact <span className="text-primary">Me</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-bold">Let's build something great together.</h3>
            <p className="text-muted-foreground leading-relaxed">
              I'm currently available for freelance projects and full-time opportunities.
              Whether you have a question or just want to say hi, I'll try my best to get back to you!
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a href={`mailto:${personalInfo.email}`} className="font-medium hover:text-primary transition-colors">
                    {personalInfo.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <a href={`tel:${personalInfo.phone.replace(/\s+/g, '')}`} className="font-medium hover:text-primary transition-colors">
                    {personalInfo.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{personalInfo.location}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <a href={personalInfo.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Github className="w-5 h-5" />
              </a>
              <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-card p-10 rounded-2xl border border-border shadow-sm flex flex-col items-center justify-center text-center space-y-6"
          >
            <div className="w-20 h-20 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-2">
              <Whatsapp className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Prefer WhatsApp?</h3>
              <p className="text-muted-foreground mb-8">
                Send me a direct message and I'll reply instantly.
              </p>
            </div>
            
            <a 
              href={`https://wa.me/${personalInfo.phone.replace(/[^0-9]/g, '')}?text=Hey%20Ali%20Haider%20we%20want%20to%20hire%20you`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-4 px-6 bg-blue-500 text-white rounded-xl font-bold text-lg hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-3 group"
            >
              <Whatsapp className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Chat on WhatsApp
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
