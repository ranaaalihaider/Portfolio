"use client";

import { motion } from "framer-motion";
import { ExternalLink, CheckCircle2 } from "lucide-react";
import { GithubIcon as Github } from "@/components/icons";
import { projectsData } from "@/data/projects";

export function FeaturedProject() {
  const featuredProject = projectsData.find((p) => p.featured);

  if (!featuredProject) return null;

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-slate-900 -z-20 -skew-y-3 hidden dark:block" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-slate-100 -z-20 -skew-y-3 block dark:hidden" />
      
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-primary-600 dark:text-primary-400 font-bold tracking-wide uppercase mb-2"
          >
            Featured Project
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold"
          >
            {featuredProject.title}
          </motion.h3>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1 space-y-6"
          >
            <div className="glass p-6 md:p-8 rounded-2xl relative z-10">
              <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed mb-6">
                {featuredProject.description}
              </p>
              
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Key Features:</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {featuredProject.keyFeatures?.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-primary-500 mr-2 shrink-0" />
                      <span className="text-slate-600 dark:text-slate-400 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {featuredProject.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-sm font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <a
                  href={featuredProject.githubUrl}
                  className="inline-flex items-center justify-center p-3 text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 dark:text-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 rounded-lg transition-colors group"
                  aria-label="GitHub Repository"
                >
                  <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href={featuredProject.liveUrl}
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-500 rounded-lg transition-colors group"
                >
                  Live Demo
                  <ExternalLink className="ml-2 w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] group bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
              {/* Fallback pattern since we don't have real images yet */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-indigo-500/20" />
              <div className="w-24 h-24 bg-white/10 rounded-full backdrop-blur flex items-center justify-center border border-white/20">
                <span className="text-4xl font-bold text-white/50">TF</span>
              </div>
              <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
