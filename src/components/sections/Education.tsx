"use client";

import { motion } from "framer-motion";
import { GraduationCap, BookOpen } from "lucide-react";
import { profileInfo } from "@/data/profile";

export function Education() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="experience" className="py-24">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Education & Background
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-16 h-1 bg-primary-500 mx-auto rounded-full mb-6"
          />
        </div>

        <div className="max-w-4xl mx-auto">
          {profileInfo.education.map((edu, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 md:p-12 shadow-sm"
            >
              <div className="flex items-start md:items-center flex-col md:flex-row mb-8">
                <div className="p-4 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl mb-4 md:mb-0 md:mr-6 shrink-0">
                  <GraduationCap className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">{edu.degree}</h3>
                  <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
                    {edu.institution}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="flex items-center text-lg font-semibold mb-4">
                  <BookOpen className="w-5 h-5 mr-2 text-primary-500" />
                  Relevant Coursework
                </h4>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex flex-wrap gap-3"
                >
                  {edu.coursework.map((course, i) => (
                    <motion.span
                      key={i}
                      variants={itemVariants}
                      className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium border border-slate-100 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                    >
                      {course}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
