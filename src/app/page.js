"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Activity, BookOpen, Smile, LogOut, ShieldCheck, Sparkles, BrainCircuit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.9 },
  visible: { 
    y: 0, opacity: 1, scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 10 }
  }
};

const Card = ({ href, icon: Icon, title, desc, colorClass, shadowColor }) => (
  <Link href={href}>
    <motion.div 
      variants={itemVariants}
      whileHover={{ scale: 1.05, rotateY: 5, rotateX: -5, z: 20 }}
      whileTap={{ scale: 0.95 }}
      style={{ transformStyle: "preserve-3d" }}
      className={`group relative flex flex-col items-center justify-center p-8 md:p-12 glass-panel rounded-3xl md:rounded-[2.5rem] cursor-pointer ${shadowColor} transition-all duration-300 overflow-hidden h-56 md:h-64 border border-white/10 hover:border-white/30`}
    >
      {/* Subtle Background Glow behind icon */}
      <div className={`absolute -top-10 -left-10 w-32 h-32 blur-[60px] opacity-0 group-hover:opacity-10 px-10 transition-opacity duration-500`} style={{ background: 'currentColor' }}></div>
      
      {/* Animated Gradient Border Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Floating Icon */}
      <motion.div 
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ translateZ: 40 }}
        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-white/5 backdrop-blur-md border border-white/10 shadow-inner transition-all ${colorClass}`}
      >
        <Icon className="w-8 h-8 drop-shadow-xl" />
      </motion.div>

      <h2 style={{ translateZ: 30 }} className="text-xl font-bold text-white mb-2 tracking-wide text-center transition-colors">
        {title}
      </h2>
      <p style={{ translateZ: 20 }} className="text-sm text-gray-400 text-center font-medium leading-relaxed">
        {desc}
      </p>

      {/* Pulsing Aura Line at bottom */}
      <div className={`absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-current to-transparent group-hover:w-full transition-all duration-700 opacity-80 ${colorClass}`}></div>
    </motion.div>
  </Link>
);

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('mindmate_user');
    if (!savedUser) {
      router.push('/login');
    } else {
      setUser(JSON.parse(savedUser));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('mindmate_user');
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen text-gray-100 font-sans pb-20 overflow-hidden relative" style={{ perspective: "1000px" }}>
      
      {/* Premium Header */}
      <header className="p-12 pb-6 flex justify-between items-center max-w-[1800px] mx-auto w-full relative z-20">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
            <div className="p-2 rgb-border rounded-xl">
                <BrainCircuit className="text-white w-6 h-6 animate-pulse" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] rgb-text">
              MindMate AI
            </h1>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 glass-panel p-2 pr-4 rounded-full border border-white/10"
        >
            <div className="w-10 h-10 rounded-full rgb-border flex items-center justify-center text-white font-bold">
                {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col hidden sm:flex">
                <span className="text-[10px] text-[#00f3ff] font-bold uppercase tracking-widest leading-none mb-1 rgb-glow">Secure ID</span>
                <span className="text-sm font-bold leading-none text-white">{user.name}</span>
            </div>
            <button 
                onClick={handleLogout}
                className="ml-2 p-2 text-gray-400 hover:text-rose-500 hover:drop-shadow-[0_0_8px_rgba(244,63,94,0.8)] transition-all"
                title="Logout"
            >
                <LogOut size={20} />
            </button>
        </motion.div>
      </header>

      <main className="flex-1 flex flex-col items-center pt-16 md:pt-24 p-6 md:p-8 text-center max-w-[1400px] mx-auto w-full relative z-10">
        
        {/* Floating Quote */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 p-4 px-8 glass-panel rounded-full border border-[#00f3ff]/30 shadow-[0_0_20px_rgba(0,243,255,0.15)] relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:animate-[scan_3s_ease-in-out_infinite]"></div>
          <p className="font-semibold text-sm text-[#00f3ff] tracking-wide relative z-10 hover:rgb-text transition-all">
            "Your mind is a universe. Let's explore it together."
          </p>
        </motion.div>
        
        {/* 3D Hero Title */}
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="relative"
        >
          <div className="absolute inset-0 blur-[60px] md:blur-[100px] bg-transparent bg-gradient-to-r from-[#00f3ff] to-[#bc13fe] opacity-30 animate-pulse rounded-full"></div>
          <h1 className="text-5xl md:text-9xl font-black mb-8 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] md:drop-shadow-[0_0_35px_rgba(255,255,255,0.4)] relative z-10 transition-all duration-700">
            NeuroCore System
          </h1>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl md:text-3xl text-white/80 max-w-4xl mb-16 md:mb-24 font-bold tracking-wide px-4"
        >
          Select a diagnostic module below to begin your biometric analysis.
        </motion.p>

        {/* Cyberpunk Grid Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full"
        >
          <Card 
            href="/gemini-chat" 
            title="Gemini Neural Chat" 
            desc="Voice-activated LLM with real-time semantic analysis."
            icon={Sparkles}
            colorClass="text-[#00f3ff]"
            shadowColor="hover:border-[#00f3ff]/50 hover:shadow-[0_0_30px_rgba(0,243,255,0.15)]"
          />

          <Card 
            href="/emotion" 
            title="Biometric Scanner" 
            desc="Optical tracking of facial landmarks and micro-expressions."
            icon={Activity}
            colorClass="text-[#bc13fe]"
            shadowColor="hover:border-[#bc13fe]/50 hover:shadow-[0_0_30px_rgba(188,19,254,0.15)]"
          />

          <Card 
            href="/chat" 
            title="Empathy Core" 
            desc="CBT-aligned conversational interface for crisis de-escalation."
            icon={Heart}
            colorClass="text-rose-400"
            shadowColor="hover:border-rose-400/50 hover:shadow-[0_0_30px_rgba(251,113,133,0.15)]"
          />

          <Card 
            href="/journal" 
            title="Data Ledger" 
            desc="Encrypted cognitive pattern logging and mood tracking."
            icon={BookOpen}
            colorClass="text-indigo-400"
            shadowColor="hover:border-indigo-400/50 hover:shadow-[0_0_30px_rgba(129,140,248,0.15)]"
          />

          <Card 
            href="/dashboard" 
            title="Analytics Hub" 
            desc="Real-time telemetry and emotional trajectory visualization."
            icon={Activity}
            colorClass="text-emerald-400"
            shadowColor="hover:border-emerald-400/50 hover:shadow-[0_0_30px_rgba(52,211,153,0.15)]"
          />

          <Card 
            href="/mood-booster" 
            title="Serotonin Override" 
            desc="Interactive protocols designed to lower cortisol levels."
            icon={Smile}
            colorClass="text-yellow-400"
            shadowColor="hover:border-yellow-400/50 hover:shadow-[0_0_30px_rgba(250,204,21,0.15)]"
          />
        </motion.div>
      </main>

      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="py-8 text-center text-gray-500 text-sm border-t border-gray-700/50 mt-auto relative z-10 glass-panel"
      >
        <p className="flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#00f3ff]" />
          System encrypted. Not a replacement for biological medical protocol.
        </p>
      </motion.footer>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateX(-100%) skewX(-15deg); }
          50% { opacity: 0.5; }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
      `}</style>
    </div>
  );
}
