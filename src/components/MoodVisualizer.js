"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MoodVisualizer = ({ mood }) => {
  const visuals = {
    happy: {
      color: 'from-amber-400 to-yellow-600',
      glow: 'rgba(251, 191, 36, 0.4)',
      text: 'Radiant & Joyful',
      particles: Array.from({ length: 15 }).map((_, i) => ({
        size: Math.random() * 8 + 4,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2
      }))
    },
    sad: {
      color: 'from-blue-600 to-indigo-900',
      glow: 'rgba(59, 130, 246, 0.3)',
      text: 'Quiet & Calm',
      particles: Array.from({ length: 10 }).map((_, i) => ({
        size: Math.random() * 12 + 6,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5
      }))
    },
    angry: {
      color: 'from-rose-600 to-red-900',
      glow: 'rgba(220, 38, 38, 0.4)',
      text: 'Powerful & Intense',
      particles: Array.from({ length: 20 }).map((_, i) => ({
        size: Math.random() * 6 + 2,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.5
      }))
    },
    fear: {
      color: 'from-purple-600 to-fuchsia-900',
      glow: 'rgba(168, 85, 247, 0.3)',
      text: 'Alert & Jittery',
      particles: Array.from({ length: 15 }).map((_, i) => ({
        size: Math.random() * 10 + 4,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 1
      }))
    },
    neutral: {
      color: 'from-[#00f3ff]/40 to-white/20',
      glow: 'rgba(0, 243, 255, 0.2)',
      text: 'Steady & Balanced',
      particles: Array.from({ length: 8 }).map((_, i) => ({
        size: Math.random() * 4 + 2,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 8
      }))
    },
    surprised: {
      color: 'from-teal-400 to-emerald-600',
      glow: 'rgba(45, 212, 191, 0.4)',
      text: 'Vibrant & Awake',
      particles: Array.from({ length: 25 }).map((_, i) => ({
        size: Math.random() * 10 + 2,
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
          {/* Main Glow Pulse */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br ${current.color} blur-[120px] rounded-full opacity-30`}
          />

          {/* Particle System */}
          {current.particles.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 0.6, 0],
                scale: [0.8, 1.2, 0.8],
                y: [0, -40, 0],
                x: [0, 20, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 6 + Math.random() * 4, 
                delay: p.delay,
                ease: "easeInOut" 
              }}
              className="absolute rounded-full blur-[2px] bg-white/20"
              style={{
                width: p.size,
                height: p.size,
                top: `${p.y}%`,
                left: `${p.x}%`,
                boxShadow: `0 0 15px ${current.glow}`
              }}
            />
          ))}

          {/* Mood Label Aura */}
          <div className="absolute inset-0 flex items-center justify-center">
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
               className="w-[80%] h-[80%] border border-white/5 rounded-full"
             />
             <motion.div 
               animate={{ rotate: -360 }}
               transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
               className="absolute w-[60%] h-[60%] border border-white/10 rounded-full"
             />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MoodVisualizer;
