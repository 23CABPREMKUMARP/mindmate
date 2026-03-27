"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Save, Activity, CalendarDays, Sparkles } from 'lucide-react';
import SuggestionsPanel from '@/components/SuggestionsPanel';

export default function JournalPage() {
  const [journals, setJournals] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState(50);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {
      const res = await fetch('/api/journal');
      const data = await res.json();
      if (data.journals) setJournals(data.journals);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, mood_score: mood })
      });
      setTitle('');
      setContent('');
      setMood(50);
      fetchJournals();
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const getMoodColor = (score) => {
    if (score < 30) return 'text-red-400 drop-shadow-[0_0_8px_#f87171] border-red-400/30';
    if (score < 60) return 'text-yellow-400 drop-shadow-[0_0_8px_#facc15] border-yellow-400/30';
    return 'text-green-400 drop-shadow-[0_0_8px_#4ade80] border-green-400/30';
  };

  const getMoodBg = (score) => {
    if (score < 30) return 'from-red-600 to-rose-400 shadow-[0_0_20px_rgba(239,68,68,0.5)]';
    if (score < 60) return 'from-yellow-500 to-orange-400 shadow-[0_0_20px_rgba(234,179,8,0.5)]';
    return 'from-green-500 to-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]';
  };

  return (
    <div className="max-w-[1800px] mx-auto p-4 md:p-12 space-y-8 md:space-y-12 relative z-10 min-h-[calc(100vh-80px)] overflow-hidden">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 md:gap-6 mb-8 md:mb-12"
      >
        <div className="p-3 md:p-4 glass-panel rounded-2xl shadow-[0_0_20px_rgba(129,140,248,0.4)] border-indigo-500/30">
          <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-indigo-400 drop-shadow-[0_0_10px_rgba(129,140,248,0.8)]" />
        </div>
        <div>
          <h1 className="text-2xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-[#bc13fe]">
            Secure Data Ledger
          </h1>
          <p className="text-xs md:text-base text-indigo-400 font-black uppercase tracking-widest mt-1">Cognitive Pattern Logging</p>
        </div>
      </motion.div>
      
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Editor Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 glass-panel p-6 md:p-8 rounded-[32px] shadow-[0_0_30px_rgba(129,140,248,0.05)] border border-indigo-500/20 relative overflow-hidden group"
        >
          {/* Subtle bg scanline */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent h-[200%] -top-[100%] group-hover:animate-[scan_4s_linear_infinite] pointer-events-none"></div>

          <div className="relative z-10 space-y-6">
            <input 
              placeholder="Initialize Subject Title..." 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              className="w-full text-xl md:text-2xl font-black bg-transparent border-b border-indigo-500/30 text-white p-2 focus:outline-none focus:border-[#00f3ff] transition-colors placeholder-gray-600"
            />
            
            <textarea 
              placeholder="Record your neural state and daily variables..." 
              value={content} 
              onChange={e => setContent(e.target.value)}
              className="w-full h-80 md:h-[500px] bg-black/20 backdrop-blur-3xl border-2 border-indigo-500/30 rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 text-white focus:outline-none focus:border-[#00f3ff] focus:shadow-[0_0_40px_rgba(0,243,255,0.15)] resize-none cyber-scrollbar transition-all leading-relaxed text-lg md:text-2xl font-medium"
            />
            
            <div className="space-y-4 pt-4 border-t border-indigo-500/20">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-400">
                <span>Subjective System Status (Mood)</span>
                <span className={getMoodColor(mood)}>Metric: {mood}%</span>
              </div>
              <div className="relative">
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={mood} 
                  onChange={e => setMood(Number(e.target.value))}
                  className="w-full h-2 bg-gray-900 rounded-full appearance-none outline-none overflow-hidden cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${mood < 30 ? '#ef4444' : mood < 60 ? '#eab308' : '#10b981'} ${mood}%, rgba(255,255,255,0.05) ${mood}%)`
                  }}
                />
                <motion.div 
                  className={`absolute top-1/2 -mt-3 w-6 h-6 rounded-full bg-gradient-to-br border-2 border-white pointer-events-none transition-all duration-300 ${getMoodBg(mood)}`}
                  style={{ left: `calc(${mood}% - 12px)` }}
                />
              </div>
            </div>
            
            <button 
              onClick={handleSave} 
              disabled={loading || !content.trim()}
              className="w-full p-4 neon-button rounded-2xl font-black tracking-widest uppercase flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:animation-none"
            >
              {loading ? <Activity className="animate-spin" /> : <Save />}
              {loading ? 'Encrypting Data...' : 'Commit to Ledger'}
            </button>
          </div>
        </motion.div>

        {/* History Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2 px-2">
            <CalendarDays size={18} className="text-indigo-400" /> Archive Records
          </h2>
          
          <div className="space-y-4 max-h-[600px] overflow-y-auto cyber-scrollbar pr-2 pb-10">
            <AnimatePresence>
              {journals.map((j, i) => (
                <motion.div 
                  key={j.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-5 glass-panel border border-white/10 rounded-2xl hover:border-indigo-400/50 hover:shadow-[0_0_20px_rgba(129,140,248,0.2)] transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-white tracking-wide truncate pr-2 group-hover:text-indigo-300 transition-colors">
                      {j.title || "Subject X-00"}
                    </h3>
                    <div className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider border backdrop-blur-sm ${getMoodColor(j.mood_score)}`}>
                      {j.mood_score}%
                    </div>
                  </div>
                  <p className="text-[10px] text-indigo-400/60 font-bold uppercase tracking-widest mb-3">
                    {new Date(j.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                  <p className="line-clamp-3 text-sm text-gray-400 leading-relaxed">
                    {j.content}
                  </p>
                </motion.div>
              ))}
              
              {journals.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center text-gray-500"
                >
                  <Sparkles className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-xs uppercase tracking-widest font-bold">No Records Found.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

      </div>

      {/* Real-time recommendations based on mood slider */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-12 pt-12 border-t border-white/5"
      >
        <SuggestionsPanel score={mood} showQuote={true} />
      </motion.div>
    </div>
  );
}
