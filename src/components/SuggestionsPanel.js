"use client";
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { MOOD_SUGGESTIONS, MOOD_QUOTES, getMoodCategory } from '@/lib/suggestionEngine';
import { ChevronRight, ExternalLink, Activity, Quote } from 'lucide-react';
import Link from 'next/link';

export default function SuggestionsPanel({ mood, score, showQuote = false }) {
  const category = getMoodCategory(mood || score || 'neutral');
  const suggestions = MOOD_SUGGESTIONS[category] || MOOD_SUGGESTIONS.neutral;
  const quote = useMemo(() => {
    const quotes = MOOD_QUOTES[category] || MOOD_QUOTES.neutral;
    return quotes[Math.floor(Math.random() * quotes.length)];
  }, [category]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-sm font-black uppercase tracking-widest text-[#00f3ff] flex items-center gap-2 drop-shadow-[0_0_8px_#00f3ff]">
          <Activity size={16} /> AI RECOM-PROTOCOL: {category}
        </h2>
        <span className="text-[10px] text-white/40 font-bold uppercase tracking-tight">Status: Neural Optimization</span>
      </div>

      {showQuote && quote && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 glass-panel border border-white/20 rounded-3xl text-center relative overflow-hidden group mb-4 shadow-lg"
          >
            <Quote className="absolute top-4 left-6 w-12 h-12 text-white/5 group-hover:text-white/10 transition-colors" />
            <p className="text-xl md:text-2xl font-black italic text-white drop-shadow-md relative z-10 leading-tight">
                "{quote.quote}"
            </p>
            <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-[#bc13fe]">
                Metric Authorization: <span className="text-white ml-2">— {quote.author}</span>
            </p>
          </motion.div>
      )}

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-3 gap-6"
      >
        {suggestions.map((item) => (
          <motion.div 
            key={item.id}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="group glass-panel p-6 rounded-3xl border border-white/10 hover:border-[#00f3ff]/30 transition-all relative overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity" style={{ background: item.color }}></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all">{item.icon}</div>
              <h3 className="font-black text-white text-lg mb-2 tracking-tight group-hover:text-[#00f3ff] transition-colors">{item.title}</h3>
              <p className="text-xs text-white/90 font-bold leading-relaxed mb-6 line-clamp-2">
                {item.desc}
              </p>
              
              <div className="mt-auto">
                {item.link ? (
                  item.isExternal ? (
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full p-3 rounded-xl border border-white/20 flex items-center justify-between text-[10px] font-black uppercase tracking-widest hover:bg-[#00f3ff]/10 hover:border-[#00f3ff]/50 hover:text-white transition-all"
                    >
                      {item.action} External <ExternalLink size={12} />
                    </a>
                  ) : (
                    <Link href={item.link} className="w-full group/btn">
                      <div className="w-full p-3 rounded-xl border border-white/20 flex items-center justify-between text-[10px] font-black uppercase tracking-widest hover:bg-[#00f3ff]/10 hover:border-[#00f3ff]/50 hover:text-white transition-all">
                        {item.action} Module <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  )
                ) : (
                  <div className="w-full p-3 rounded-xl border border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500 cursor-default">
                    {item.action} Manual-Op
                  </div>
                )}
              </div>
            </div>
            
            {/* Animated Bottom Progress Line */}
            <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-transparent via-[#00f3ff] to-transparent group-hover:w-full transition-all duration-700"></div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
