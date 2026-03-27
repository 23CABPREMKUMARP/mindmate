"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Home, 
  MessageCircle, 
  BookOpen, 
  Activity, 
  SmilePlus, 
  Sparkles,
  Menu,
  X,
  ScanFace
} from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

export default function Sidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: '/', icon: Home, label: t('nav.home'), glow: 'rgba(0,243,255,1)' },
    { href: '/chat', icon: MessageCircle, label: t('nav.chat'), glow: 'rgba(251,113,133,1)' },
    { href: '/gemini-chat', icon: Sparkles, label: t('chat.title'), glow: 'rgba(0,243,255,1)' },
    { href: '/emotion', icon: ScanFace, label: t('nav.emotion'), glow: 'rgba(188,19,254,1)' },
    { href: '/journal', icon: BookOpen, label: t('nav.journal'), glow: 'rgba(129,140,248,1)' },
    { href: '/dashboard', icon: Activity, label: t('dashboard.title'), glow: 'rgba(52,211,153,1)' },
    { href: '/mood-booster', icon: SmilePlus, label: t('nav.mood'), glow: 'rgba(250,204,21,1)' }
  ];

  // If on login pages, hide the sidebar entirely
  if (['/login', '/register', '/face-login', '/register-face'].includes(pathname)) {
    return null;
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-[60] p-3 rounded-xl glass-panel text-white hover:text-[#00f3ff] transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Container */}
      <motion.nav 
        initial={{ x: -250 }}
        animate={{ x: isOpen ? 0 : 0 }} // On mobile, controlled by state, on desktop always 0
        className={`fixed inset-y-0 left-0 z-50 w-64 glass-panel border-r border-white/10 flex flex-col pt-20 md:pt-14 bg-[#02000f]/90 backdrop-blur-3xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-8 mb-14">
          <div className="p-3 rgb-border rounded-2xl bg-[#00f3ff]/10">
            <ScanFace className="text-[#00f3ff] w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">
            EMOAI <span className="text-[#00f3ff]">PRO</span>
          </h1>
        </div>

        {/* Nav Links */}
        <div className="flex-1 px-4 space-y-3 overflow-y-auto w-full cyber-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setIsOpen(false)}
              >
                <div className={`
                  group relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 
                  ${isActive 
                    ? 'bg-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] rgb-border' 
                    : 'hover:bg-white/5 border border-transparent'
                  }
                `}>
                  {/* Active Indicator Glow */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent to-[#00f3ff]/5 border border-white/10 pointer-events-none"
                    />
                  )}
                  
                  <item.icon 
                    size={22} 
                    className="relative z-10 transition-all duration-300 group-hover:scale-125"
                    style={{ 
                      color: isActive ? item.glow : 'rgba(255, 255, 255, 0.4)',
                      filter: `drop-shadow(0 0 10px ${isActive ? item.glow : 'rgba(255,255,255,0.05)'})`
                    }}
                  />
                  <span className={`relative z-10 font-black tracking-[0.15em] transition-all text-[11px] uppercase ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white'}`}>
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom Profile / Settings Area */}
        <div className="p-4 mt-auto border-t border-white/10 space-y-4 relative overflow-visible">
           <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#bc13fe]/10 via-transparent to-transparent h-48 pointer-events-none"></div>
           
           <LanguageSwitcher />

           <div className="flex items-center gap-3 px-5 py-3 rounded-2xl glass-panel relative z-10 bg-white/5 border border-white/10 group hover:border-green-400/30 transition-all cursor-default overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/5 to-transparent h-full w-[200%] animate-[scan_6s_linear_infinite] pointer-events-none"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_15px_#4ade80] animate-pulse relative z-10 shrink-0"></div>
               <span className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase relative z-10">System Online</span>
           </div>
        </div>
      </motion.nav>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        />
      )}
    </>
  );
}
