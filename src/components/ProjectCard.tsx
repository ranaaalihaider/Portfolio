"use client";
import Image from "next/image";
import { useState } from "react";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

interface Project {
  id: string;
  title: string;
  type: string;
  description: string;
  features: string[];
  technologies: string[];
  screenshots: string[];
  github: string;
  link: string;
}

export default function ProjectCard({ project }: { project: Project }) {
  const [activeImg, setActiveImg] = useState(0);

  const hasLink = !!project.link;
  const hasGithub = !!project.github;
  const primaryUrl = project.link || project.github;

  // Show up to 6 screenshots in mosaic
  const mosaicShots = project.screenshots.slice(0, 6);
  const heroShot = project.screenshots[activeImg] ?? null;

  const openProject = () => {
    if (primaryUrl) window.open(primaryUrl, "_blank", "noreferrer");
  };

  return (
    <div className="project-card group relative flex flex-col rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/20">
      
      {/* ── Screenshot area ── */}
      <div className="relative w-full bg-black/40 overflow-hidden" style={{ minHeight: "260px" }}>

        {heroShot ? (
          <div
            className="relative w-full cursor-pointer"
            style={{ height: "260px" }}
            onClick={openProject}
          >
            <Image
              src={heroShot}
              alt={`${project.title} screenshot`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          </div>
        ) : (
          /* No screenshot — placeholder with gradient */
          <div
            className="flex items-center justify-center cursor-pointer"
            style={{ height: "260px" }}
            onClick={openProject}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 via-purple-900/40 to-black/60" />
            <span className="relative text-6xl opacity-30">💻</span>
          </div>
        )}

        {/* Top-right links overlay */}
        <div className="absolute top-3 right-3 flex gap-2 z-20">
          {hasGithub && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition-all"
              title="View on GitHub"
            >
              <FaGithub size={13} />
              GitHub
            </a>
          )}
          {hasLink && (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 rounded-full bg-indigo-600/80 backdrop-blur-sm border border-indigo-400/30 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-all"
              title="View Live Project"
            >
              <FaExternalLinkAlt size={11} />
              Live
            </a>
          )}
        </div>

        {/* Thumbnail strip — multiple screenshots */}
        {mosaicShots.length > 1 && (
          <div className="absolute bottom-2 left-2 right-2 flex gap-1.5 z-20 overflow-x-auto no-scrollbar">
            {mosaicShots.map((src, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setActiveImg(i); }}
                className={`relative flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  i === activeImg
                    ? "border-indigo-400 scale-110 shadow-lg shadow-indigo-500/40"
                    : "border-white/20 hover:border-white/50 opacity-70 hover:opacity-100"
                }`}
                style={{ width: 52, height: 36 }}
              >
                <Image src={src} alt={`thumb ${i + 1}`} fill className="object-cover" unoptimized />
              </button>
            ))}
            {project.screenshots.length > 6 && (
              <div className="flex-shrink-0 flex items-center justify-center rounded-lg bg-black/60 border border-white/20 text-white text-xs font-bold" style={{ width: 52, height: 36 }}>
                +{project.screenshots.length - 6}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="flex flex-1 flex-col p-6 cursor-pointer" onClick={openProject}>
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-indigo-400">
            {project.type}
          </span>
        </div>

        <h3 className="mb-2 text-xl font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
          {project.title}
        </h3>

        <p className="mb-4 flex-1 text-sm text-white/60 leading-relaxed line-clamp-3">
          {project.description}
        </p>

        {/* Tech tags */}
        {project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-[11px] font-medium text-indigo-300"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* CTA row */}
        <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-white/40">
            {project.screenshots.length > 0 ? `${project.screenshots.length} screenshots` : "No preview"}
          </span>
          <div className="flex items-center gap-3">
            {hasGithub && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-white/50 hover:text-white transition-colors"
              >
                <FaGithub size={18} />
              </a>
            )}
            {hasLink && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Visit <FaExternalLinkAlt size={11} />
              </a>
            )}
            {!hasLink && hasGithub && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                View Repo <FaGithub size={13} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
