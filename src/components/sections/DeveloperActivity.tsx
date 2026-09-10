"use client";

import { motion } from "framer-motion";
import { Activity, GitCommit, Star, GitPullRequest } from "lucide-react";
import { GithubIcon as Github } from "@/components/icons";
import { profileInfo } from "@/data/profile";

export function DeveloperActivity() {
  const githubUrl = profileInfo.socials.find((s) => s.label === "GitHub")?.url || "#";

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center">
              <Github className="w-8 h-8 mr-3 text-primary-600 dark:text-primary-400" />
              Developer Activity
            </h2>
            <div className="w-16 h-1 bg-primary-500 rounded-full mb-6" />
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8">
              I actively contribute to open-source and maintain a consistent coding streak. My GitHub profile is a reflection of my passion for continuous learning and building software.
            </p>
            <a
              href={githubUrl}
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 rounded-full transition-colors group"
            >
              View GitHub Profile
              <Activity className="ml-2 w-4 h-4 group-hover:animate-pulse" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {/* Placeholder stats since actual API integration isn't required */}
            {[
              { label: "Repositories", value: "30+", icon: FolderOpen },
              { label: "Contributions", value: "1.2k+", icon: GitCommit },
              { label: "Stars", value: "50+", icon: Star },
              { label: "Pull Requests", value: "100+", icon: GitPullRequest },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform"
                >
                  <Icon className="w-6 h-6 text-primary-500 mb-3" />
                  <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Temporary icon to avoid import error above
import { FolderOpen } from "lucide-react";
