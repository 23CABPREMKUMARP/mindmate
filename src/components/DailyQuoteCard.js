"use client";
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Quote, Sparkles } from 'lucide-react';
import { MOOD_QUOTES, getMoodCategory } from '@/lib/suggestionEngine';

export default function DailyQuoteCard({ mood, score, variant = "glass" }) {
  const category = getMoodCategory(mood || score || 'neutral');
  const quotes = MOOD_QUOTES[category] || MOOD_QUOTES.neutral;
  
  // Pick a stable quote for the day (or session)
  const quote = useMemo(() => {
    return quotes[Math.floor(Math.random() * quotes.length)];
  }, [category, quotes]);

  if (variant === "simple") {
      return (
          <div className="text-center italic text-gray-400 group">
              <span className="text-xs font-black uppercase tracking-widest text-[#00f3ff] block mb-2 opacity-50">Logon Motivation</span>
              "{quote.quote}"
              <p className="mt-2 text-[10px] font-bold text-gray-600">— {quote.author}</p>
          </div>
      );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel p-8 rounded-[40px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden group"
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#00f3ff]/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-[#00f3ff]/10 transition-colors"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#bc13fe]/5 blur-[80px] rounded-full pointer-events-none"></div>

      {/* Quote Icon */}
      <div className="absolute top-6 left-8 opacity-10 group-hover:opacity-20 transition-opacity">
        <Quote className="w-16 h-16 text-white" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div 
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 6 }}
            className="mb-6 p-3 bg-white/5 rounded-2xl border border-white/10 shadow-inner"
        >
            <Sparkles className="w-8 h-8 text-[#00f3ff] drop-shadow-[0_0_10px_rgba(0,243,255,0.8)]" />
        </motion.div>

        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 mb-6 drop-shadow-[0_0_4px_black]">
          Synchronized Neural Motivation
        </h3>

        <blockquote className="text-2xl md:text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500 mb-8 leading-tight max-w-2xl px-4">
          "{quote.quote}"
        </blockquote>

        <div className="flex flex-col items-center">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#00f3ff] to-transparent mb-4"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#00f3ff]">
              Source: <span className="text-white ml-2">{quote.author}</span>
            </p>
        </div>
      </div>

      {/* Corner Detail */}
      <div className="absolute bottom-4 right-8 text-[8px] font-bold text-white/30 tracking-widest uppercase pointer-events-none">
        Aura Hash: {category.toUpperCase()}-0x{Math.floor(Math.random()*1000)}
      </div>

      {/* Aura Line */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-[#00f3ff] to-transparent group-hover:w-full transition-all duration-700 opacity-80"></div>
    </motion.div>
  );
}
