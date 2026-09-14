"use client";
import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { projects } from "@/data/portfolio";

/* ─────────────────────────────────────────────
   Smooth mosaic:
   • Top hero: one image slowly crossfades every 4 s
   • Bottom: CSS-keyframe marquee strip — pure GPU,
     no JS re-renders, silky 60 fps scroll
───────────────────────────────────────────── */
function HeroCard({
  project,
  heroSrc,
  fading,
  heroIdx,
  totalShots,
}: {
  project: (typeof projects)[0];
  heroSrc: string;
  fading: boolean;
  heroIdx: number;
  totalShots: number;
}) {
  const [showAbout, setShowAbout] = useState(false);

  // Close about when project changes
  useEffect(() => { setShowAbout(false); }, [project.id]);

  return (
    <div className="relative flex-1 min-h-0 overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/70">
      {/* Background image */}
      <Image
        key={heroSrc}
        src={heroSrc}
        alt={project.title}
        fill
        className="object-cover"
        style={{ transition: "opacity 0.6s ease", opacity: fading ? 0 : 1 }}
        unoptimized
        priority
      />

      {/* Base vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

      {/* ── About overlay (dark + white text) ── */}
      <div
        className="absolute inset-0 flex flex-col justify-center px-8 transition-all duration-500"
        style={{
          background: showAbout ? "rgba(0,0,0,0.82)" : "transparent",
          backdropFilter: showAbout ? "blur(2px)" : "none",
          pointerEvents: showAbout ? "auto" : "none",
          opacity: showAbout ? 1 : 0,
        }}
      >
        <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-400 mb-2">{project.type}</p>
        <h3 className="text-3xl font-black text-white mb-4">{project.title}</h3>
        <p className="text-sm text-white/80 leading-relaxed max-w-2xl mb-6">{project.description}</p>
        {project.features.length > 0 && (
          <ul className="grid grid-cols-2 gap-2 max-w-lg">
            {project.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Transparent Header bar ── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-5 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        {/* Left: project name */}
        <span className="text-lg font-black text-white drop-shadow-md truncate max-w-[60%]">{project.title}</span>

        {/* Right: action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAbout((v) => !v)}
            className={`rounded-full border px-4 py-2 text-sm font-bold transition-all duration-300 ${
              showAbout
                ? "bg-white text-black border-white shadow-lg shadow-white/20"
                : "bg-black/40 backdrop-blur-md border-white/40 text-white hover:bg-white/20 hover:border-white/60 shadow-lg"
            }`}
          >
            {showAbout ? "✕ Close" : "About"}
          </button>

          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-md border border-white/40 px-4 py-2 text-sm font-bold text-white hover:bg-white/20 hover:border-white/60 shadow-lg transition-all"
            >
              <FaGithub size={16} /> GitHub
            </a>
          )}

          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full bg-indigo-600/90 backdrop-blur-md border border-indigo-400/50 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all"
            >
              <FaExternalLinkAlt size={14} /> Live
            </a>
          )}
        </div>
      </div>

      {/* Dot indicators */}
      {totalShots > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {Array.from({ length: totalShots }).map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-500 ${
                i === heroIdx ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/30"
              }`}
            />
          ))}
        </div>
      )}

      {/* Inner highlight */}
      <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] pointer-events-none" />
    </div>
  );
}

function SmoothMosaic({ project }: { project: (typeof projects)[0] }) {
  const shots = project.screenshots;
  const [heroIdx, setHeroIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const [fading, setFading] = useState(false);

  // Reset on project change
  useEffect(() => {
    setHeroIdx(0);
    setPrevIdx(null);
    setFading(false);
  }, [project.id]);

  // Crossfade hero every 4 s
  useEffect(() => {
    if (shots.length <= 1) return;
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setPrevIdx((prev) => prev ?? 0);
        setHeroIdx((h) => (h + 1) % shots.length);
        setTimeout(() => setFading(false), 600);
      }, 200);
    }, 4000);
    return () => clearInterval(id);
  }, [shots.length, project.id]);

  if (shots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-black/60">
        <span className="text-6xl opacity-20">💻</span>
        <p className="text-white/30 text-sm">No screenshots yet</p>
      </div>
    );
  }

  const hero = shots[heroIdx];

  // Duplicate strip for seamless infinite scroll
  const strip = shots.length > 1 ? [...shots, ...shots] : shots;
  // Each tile: 200px wide. Total strip width = strip.length * 208
  const stripW = strip.length * 208;
  const animDuration = strip.length * 4; // seconds — speed relative to count

  return (
    <div className="flex flex-col h-full gap-2">
      <HeroCard
        project={project}
        heroSrc={hero}
        fading={fading}
        heroIdx={heroIdx}
        totalShots={shots.length}
      />

      {/* ── MARQUEE STRIP (pure CSS, GPU only) ── */}
      {shots.length > 1 && (
        <div
          className="overflow-hidden flex-shrink-0 rounded-xl"
          style={{ height: "100px" }}
        >
          <div
            className="flex gap-2 h-full"
            style={{
              width: `${stripW}px`,
              animation: `marquee-scroll ${animDuration}s linear infinite`,
              willChange: "transform",
            }}
          >
            {strip.map((src, i) => (
              <div
                key={i}
                className="relative flex-shrink-0 overflow-hidden rounded-lg border border-white/10 shadow-lg shadow-black/50 ring-1 ring-white/5"
                style={{ width: "200px" }}
              >
                <Image
                  src={src}
                  alt={`${project.title} ${i + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 rounded-lg shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main section
───────────────────────────────────────────── */
export default function ProjectsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const active = projects[activeIndex];

  const scrollTo = useCallback((i: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const target =
      section.offsetTop +
      (i / projects.length) * (section.offsetHeight - window.innerHeight);
    window.scrollTo({ top: target, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(0.999, -rect.top / scrollable));
      setActiveIndex(Math.floor(progress * projects.length));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Inject keyframe globally */}
      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>

      <section
        id="projects"
        ref={sectionRef}
        style={{ height: `${projects.length * 40}vh` }}
        className="relative"
      >
        <div className="sticky top-0 h-screen flex flex-col overflow-hidden px-3 py-4">

          {/* ── Header ── */}
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
            <div>
              <h2 className="text-2xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Portfolio
              </h2>
              <p className="text-xs text-white/30 mt-0.5">Scroll to explore</p>
            </div>
            <div className="flex items-center gap-1.5">
              {projects.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  className={`rounded-full transition-all duration-500 ${
                    i === activeIndex
                      ? "w-6 h-2 bg-indigo-400 shadow-lg shadow-indigo-500/50"
                      : i < activeIndex
                      ? "w-2 h-2 bg-indigo-600/50"
                      : "w-2 h-2 bg-white/20"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ── Two-column layout ── */}
          <div className="flex flex-1 gap-4 min-h-0 w-full">

            {/* LEFT: list */}
            <div className="hidden lg:flex flex-col gap-1.5 w-56 flex-shrink-0 overflow-y-auto no-scrollbar">
              {projects.map((project, i) => (
                <button
                  key={project.id}
                  onClick={() => scrollTo(i)}
                  className={`group text-left px-4 py-3 rounded-xl border transition-all duration-500 flex-shrink-0 ${
                    i === activeIndex
                      ? "bg-indigo-600/20 border-indigo-500/50 shadow-lg shadow-indigo-500/10"
                      : i < activeIndex
                      ? "bg-white/[0.02] border-white/5 opacity-40"
                      : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className={`font-semibold text-sm leading-tight transition-colors ${
                      i === activeIndex ? "text-indigo-300" : "text-white/70 group-hover:text-white"
                    }`}>
                      {project.title}
                    </p>
                    {i === activeIndex && (
                      <span className="text-indigo-400 text-[10px] animate-pulse ml-2">●</span>
                    )}
                  </div>
                  <p className="text-[10px] text-white/30 mt-0.5 leading-tight">{project.type}</p>
                  {i === activeIndex && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.technologies.slice(0, 3).map((t) => (
                        <span key={t} className="text-[9px] bg-indigo-500/15 border border-indigo-500/20 text-indigo-300 rounded-full px-1.5 py-0.5">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* RIGHT: mosaic + info */}
            <div className="flex-1 flex flex-col gap-3 min-w-0">

              {/* Mosaic */}
              <div key={active.id} className="flex-1 min-h-0 relative animate-in fade-in duration-500">
                <SmoothMosaic project={active} />

                {/* Bottom overlay */}
                <div className="absolute bottom-[108px] left-0 right-0 px-4 pb-2 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-b-2xl pointer-events-none z-10">
                  <div className="flex items-end justify-between flex-wrap gap-2 pointer-events-auto">
                    <div>
                      <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">{active.type}</p>
                      <h3 className="text-xl font-black text-white leading-tight">{active.title}</h3>
                    </div>
                    <div className="flex gap-2">
                      {active.github && (
                        <a href={active.github} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition-all">
                          <FaGithub size={13} /> GitHub
                        </a>
                      )}
                      {active.link && (
                        <a href={active.link} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1.5 rounded-full bg-indigo-600 border border-indigo-400/30 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-all">
                          <FaExternalLinkAlt size={11} /> Live
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Info row */}
              <div className="grid grid-cols-2 gap-3 flex-shrink-0">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <h4 className="text-[10px] font-bold text-white/50 mb-1.5 uppercase tracking-wider">About</h4>
                  <p className="text-xs text-white/50 leading-relaxed line-clamp-2">{active.description}</p>
                </div>
                {active.features.length > 0 ? (
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <h4 className="text-[10px] font-bold text-white/50 mb-1.5 uppercase tracking-wider">Key Features</h4>
                    <ul className="grid grid-cols-2 gap-1">
                      {active.features.slice(0, 6).map((f) => (
                        <li key={f} className="flex items-center gap-1 text-[10px] text-white/40">
                          <span className="w-1 h-1 rounded-full bg-indigo-400 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 flex items-center justify-center">
                    <p className="text-xs text-white/20">No features listed</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
