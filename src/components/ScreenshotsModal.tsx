"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Pause, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ScreenshotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  screenshots: string[];
  projectTitle: string;
}

export default function ScreenshotsModal({ isOpen, onClose, screenshots, projectTitle }: ScreenshotsModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  // Drag to scroll state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsAutoPlaying(true); // Reset to playing when opened
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Smooth Auto-scroll effect
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const autoScroll = (time: number) => {
      if (isAutoPlaying && scrollRef.current) {
        const deltaTime = time - lastTime;
        if (deltaTime > 16) { // Cap at ~60fps
          scrollRef.current.scrollLeft += 1.5; // Scroll speed
          lastTime = time;

          // Seamless loop: if scrolled past halfway (since we duplicated images), reset to 0
          if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth / 2) {
            scrollRef.current.scrollLeft = 0;
          }
        }
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    if (isOpen) {
      animationFrameId = requestAnimationFrame(autoScroll);
    }
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [isOpen, isAutoPlaying]);

  if (!isOpen) return null;

  // Duplicate screenshots to create a seamless infinite loop for native scrolling
  const duplicatedScreenshots = [...screenshots, ...screenshots];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] flex flex-col bg-background/95 backdrop-blur-md"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-border/50">
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-bold">{projectTitle} <span className="text-primary font-normal text-lg ml-2">Screenshots</span></h3>
              
              {/* Play/Pause Toggle */}
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="ml-4 p-2 flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-full transition-colors text-sm font-bold"
              >
                {isAutoPlaying ? (
                  <>
                    <Pause className="w-4 h-4" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" /> Play
                  </>
                )}
              </button>
            </div>

            <button 
              onClick={onClose}
              className="p-2 bg-muted hover:bg-primary/20 hover:text-primary rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Scrollable Gallery Container */}
          <div className="flex-1 flex items-center relative overflow-hidden group">
            
            {/* Left Navigation Arrow */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsAutoPlaying(false);
                if (scrollRef.current) {
                  scrollRef.current.scrollBy({ left: -window.innerWidth * 0.6, behavior: 'smooth' });
                }
              }}
              className="absolute left-2 md:left-4 z-50 p-2 md:p-4 bg-background/80 hover:bg-primary/90 text-primary hover:text-primary-foreground backdrop-blur-xl rounded-full shadow-[0_0_20px_rgba(var(--primary),0.2)] opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 transform md:-translate-x-4 md:group-hover:translate-x-0"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            {/* Right Navigation Arrow */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsAutoPlaying(false);
                if (scrollRef.current) {
                  scrollRef.current.scrollBy({ left: window.innerWidth * 0.6, behavior: 'smooth' });
                }
              }}
              className="absolute right-2 md:right-4 z-50 p-2 md:p-4 bg-background/80 hover:bg-primary/90 text-primary hover:text-primary-foreground backdrop-blur-xl rounded-full shadow-[0_0_20px_rgba(var(--primary),0.2)] opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 transform md:translate-x-4 md:group-hover:translate-x-0"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <div 
              ref={scrollRef}
              className={`flex gap-8 px-8 w-full overflow-x-auto no-scrollbar pb-8 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              onPointerDown={(e) => {
                setIsAutoPlaying(false);
                setIsDragging(true);
                if (scrollRef.current) {
                  setStartX(e.pageX - scrollRef.current.offsetLeft);
                  setScrollLeft(scrollRef.current.scrollLeft);
                }
              }}
              onPointerMove={(e) => {
                if (!isDragging || !scrollRef.current) return;
                e.preventDefault();
                const x = e.pageX - scrollRef.current.offsetLeft;
                const walk = (x - startX) * 2;
                scrollRef.current.scrollLeft = scrollLeft - walk;
              }}
              onPointerUp={() => {
                setIsDragging(false);
                setIsAutoPlaying(true);
              }}
              onPointerLeave={() => {
                setIsDragging(false);
                setIsAutoPlaying(true);
              }}
            >
              {duplicatedScreenshots.map((src, index) => (
                <div 
                  key={index} 
                  className="shrink-0 w-[85vw] md:w-[70vw] lg:w-[60vw] aspect-video rounded-xl overflow-hidden border-2 border-primary/20 shadow-2xl"
                >
                  <img 
                    src={src} 
                    alt={`Screenshot ${index}`} 
                    className="w-full h-full object-contain bg-muted/20"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Footer instruction / Close button */}
          <div className="p-6 text-center border-t border-border/50 bg-background/50 flex flex-col items-center gap-4">
            <p className="text-muted-foreground text-sm">
              {isAutoPlaying ? "Auto-scrolling... Click and hold an image to pause." : "Paused. Release to resume scrolling."}
            </p>
            <button 
              onClick={onClose}
              className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg hover:shadow-primary/25"
            >
              Close Gallery
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
