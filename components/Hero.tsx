import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Play, Pause } from "lucide-react";
import { Language, TRANSLATIONS } from "../types";

interface HeroProps {
  currentLanguage: Language;
  onExploreClick: () => void;
}

const SHIELD_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1920",
    collection: "AUTUMN / WINTER ATELIER",
    title: "SARTORIAL SILENT LUXURY",
    quote: "A sublime study on virgin wool framing and heavyweight Italian cashmere.",
  },
  {
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1920",
    collection: "THE MINIMALIST FORM",
    title: "ARCHITECTURAL SCALE DREAMS",
    quote: "A curation of pure fluid silhouettes engineered for contemporary comfort.",
  },
  {
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1920",
    collection: "ORGANIC TEXTILES",
    title: "MULBERRY SILK & FLAX",
    quote: "A tactile research loop, harvesting finest premium Belgian organic flax.",
  }
];

export default function Hero({ currentLanguage, onExploreClick }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const t = TRANSLATIONS[currentLanguage];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SHIELD_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <section className="relative w-full h-[85vh] bg-neutral-900 overflow-hidden flex items-end">
      
      {/* Editorial Slideshow */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Dark Editorial Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
            
            <img
              src={SHIELD_SLIDES[currentSlide].image}
              alt={SHIELD_SLIDES[currentSlide].title}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Hero Content */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24 text-white">
        <div className="max-w-2xl">
          <motion.p
            key={`col-${currentSlide}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-stone-300 mb-2 sm:mb-4"
          >
            {SHIELD_SLIDES[currentSlide].collection}
          </motion.p>
          
          <motion.h1
            key={`title-${currentSlide}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.1 }}
            className="font-sans text-4xl sm:text-6xl font-light tracking-[0.1em] uppercase mb-4 sm:mb-6 leading-tight"
          >
            {t.heroHeading}
          </motion.h1>

          <motion.p
            key={`desc-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="font-sans font-light text-neutral-300 text-sm sm:text-base tracking-wide mb-8 sm:mb-10 max-w-lg leading-relaxed"
          >
            {SHIELD_SLIDES[currentSlide].quote}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <button
              id="hero-explore-cta"
              onClick={onExploreClick}
              className="group flex items-center justify-center space-x-3 bg-white text-neutral-950 hover:bg-neutral-100 hover:scale-[1.02] px-8 py-4 text-xs tracking-widest uppercase font-medium transition-all active:scale-95 cursor-pointer rounded-sm shadow-xl"
            >
              <span>{t.shopCollection}</span>
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1.5 transition-transform" />
            </button>

            {/* Simulated Live Broadcast Stream Button */}
            <div className="flex items-center space-x-2 text-xs font-mono tracking-wider text-neutral-300 justify-center sm:justify-start">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-stone-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-stone-300"></span>
              </span>
              <span>ATELIER COPENHAGEN STREAM</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Slide Navigation Controls */}
      <div className="absolute right-4 bottom-8 sm:right-12 sm:bottom-12 z-20 flex items-center space-x-4">
        <button
          id="hero-play-pause-btn"
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 border border-white/20 hover:border-white/60 hover:bg-white/10 rounded-full text-white transition-all scale-95"
          title={isPlaying ? "Pause stream" : "Play stream"}
        >
          {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
        </button>

        <div className="flex space-x-2">
          {SHIELD_SLIDES.map((_, index) => (
            <button
              id={`hero-dot-${index}`}
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-500 ${index === currentSlide ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"}`}
            />
          ))}
        </div>
      </div>

    </section>
  );
}
