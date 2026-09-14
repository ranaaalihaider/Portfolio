"use client";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";

async function initEngine(engine: Engine) {
  await loadSlim(engine);
}

export default function ParticlesBackground() {
  return (
    <ParticlesProvider init={initEngine}>
      <Particles
        id="tsparticles"
        options={{
          background: { color: { value: "transparent" } },
          fpsLimit: 60,
          interactivity: {
            events: {
              onClick: { enable: true, mode: "repulse" },
              onHover: { enable: true, mode: "grab" },
            },
            modes: {
              repulse: { distance: 200, duration: 0.6 },
              grab: {
                distance: 180,
                links: { opacity: 0.8 },
              },
            },
          },
          particles: {
            color: {
              value: ["#6366f1", "#8b5cf6", "#3b82f6", "#06b6d4", "#a78bfa"],
            },
            links: {
              color: { value: ["#6366f1", "#8b5cf6", "#3b82f6"] },
              distance: 160,
              enable: true,
              opacity: 0.25,
              width: 1,
              triangles: {
                enable: true,
                opacity: 0.04,
              },
            },
            move: {
              enable: true,
              speed: 1.2,
              direction: "none",
              random: true,
              straight: false,
              outModes: { default: "bounce" },
            },
            number: {
              density: { enable: true, width: 1920 },
              value: 90,
            },
            opacity: {
              value: { min: 0.2, max: 0.7 },
              animation: {
                enable: true,
                speed: 1,
                sync: false,
              },
            },
            shape: {
              type: ["circle", "triangle"],
            },
            size: {
              value: { min: 1, max: 4 },
              animation: {
                enable: true,
                speed: 3,
                sync: false,
              },
            },
            twinkle: {
              particles: {
                enable: true,
                frequency: 0.05,
                opacity: 1,
              },
            },
          },
          detectRetina: true,
        }}
        className="fixed inset-0 -z-10"
      />
    </ParticlesProvider>
  );
}
