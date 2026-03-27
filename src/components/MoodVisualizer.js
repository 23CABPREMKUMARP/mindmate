"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MoodVisualizer = ({ mood }) => {
  const visuals = {
    happy: {
      color: 'from-amber-400 to-yellow-600',
      text: 'Radiant & Joyful',
      particles: Array.from({ length: 8 }).map((_, i) => ({
        size: Math.random() * 6 + 4,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2
      }))
    },
    sad: {
      color: 'from-blue-600 to-indigo-900',
      text: 'Quiet & Calm',
      particles: Array.from({ length: 5 }).map((_, i) => ({
        size: Math.random() * 10 + 6,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5
      }))
    },
    angry: {
      color: 'from-rose-600 to-red-900',
      text: 'Powerful & Intense',
      particles: Array.from({ length: 10 }).map((_, i) => ({
        size: Math.random() * 5 + 2,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.5
      }))
    },
    fear: {
      color: 'from-purple-600 to-fuchsia-900',
      text: 'Alert & Jittery',
      particles: Array.from({ length: 8 }).map((_, i) => ({
        size: Math.random() * 8 + 4,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 1
      }))
    },
    neutral: {
      color: 'from-[#00f3ff]/40 to-white/20',
      text: 'Steady & Balanced',
      particles: Array.from({ length: 4 }).map((_, i) => ({
        size: Math.random() * 4 + 2,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 8
      }))
    },
    surprised: {
      color: 'from-teal-400 to-emerald-600',
      text: 'Vibrant & Awake',
      particles: Array.from({ length: 12 }).map((_, i) => ({
        size: Math.random() * 8 + 2,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.1
      }))
    }
  };

  const current = visuals[mood?.toLowerCase()] || visuals.neutral;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[32px]">
      <AnimatePresence mode="wait">
        <motion.div 
          key={mood}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full h-full relative"
        >
          {/* Main Glow Pulse - Simplified blur */}
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br ${current.color} blur-[60px] rounded-full opacity-30`}
          />

          {/* Particle System - Performance Optimized */}
          {current.particles.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 0.5, 0],
                scale: [0.9, 1.1, 0.9],
                y: [0, -20, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 8 + Math.random() * 4, 
                delay: p.delay,
                ease: "linear" 
              }}
              className="absolute rounded-full bg-white/10"
              style={{
                width: p.size,
                height: p.size,
                top: `${p.y}%`,
                left: `${p.x}%`,
                willChange: 'transform, opacity'
              }}
            />
          ))}

          {/* Static Auras for consistency without animation cost */}
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-[80%] h-[80%] border border-white/5 rounded-full" />
             <div className="absolute w-[60%] h-[60%] border border-white/10 rounded-full" />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MoodVisualizer;
