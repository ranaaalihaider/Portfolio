"use client";

import { Mail } from "lucide-react";
import { GithubIcon as Github, LinkedinIcon as Linkedin } from "@/components/icons";
import { profileInfo } from "@/data/profile";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialIcons = {
    Github: Github,
    Linkedin: Linkedin,
    Mail: Mail,
  };

  return (
    <footer className="py-12 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-6 md:mb-0 text-center md:text-left">
          <h3 className="text-xl font-bold tracking-tighter mb-1">
            {profileInfo.name}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {profileInfo.role}
          </p>
        </div>

        <div className="flex items-center space-x-6 mb-6 md:mb-0">
          {profileInfo.socials.map((social) => {
            const Icon = socialIcons[social.icon as keyof typeof socialIcons];
            return (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label={social.label}
              >
                <Icon className="w-5 h-5" />
              </a>
            );
          })}
        </div>

        <div className="text-sm text-slate-500 dark:text-slate-400">
          &copy; {currentYear} {profileInfo.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
