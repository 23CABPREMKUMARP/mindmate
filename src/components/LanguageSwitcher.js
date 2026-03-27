"use client";
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check } from 'lucide-react';
import '@/lib/i18n'; // Force init on client

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' }
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Use the established i18n instance
  const activeLangCode = i18n.language ? i18n.language.split('-')[0] : 'en';
  const currentLang = languages.find(l => l.code === activeLangCode) || languages[0];

  const changeLanguage = (code) => {
    console.log(`EMOAI_DEBUG: Switching to ${code}`);
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  if (!mounted) return null;

  return (
    <div className="relative w-full">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-5 py-3 glass-panel rounded-2xl border border-white/10 hover:border-[#00f3ff]/40 transition-all group relative overflow-hidden bg-white/5 shadow-lg"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent h-full w-[200%] animate-[scan_6s_linear_infinite] pointer-events-none"></div>
        <div className="flex items-center gap-3 relative z-10">
          <Globe className="w-4 h-4 text-[#00f3ff] group-hover:rotate-12 transition-transform duration-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">
            {currentLang.native}
          </span>
        </div>
        <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest relative z-10 px-2 py-1 bg-black/40 rounded-lg group-hover:text-white transition-colors">
          Switch
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute bottom-full left-0 mb-3 w-full glass-panel rounded-[24px] border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl overflow-hidden z-[100]"
          >
            <div className="p-3 space-y-2">
              <div className="px-3 py-1 mb-2 text-[8px] font-black uppercase tracking-[0.3em] text-[#00f3ff]/60 border-b border-white/5">
                Neural Interface Language
              </div>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full flex items-center justify-between px-4 py-4 rounded-xl transition-all ${
                    i18n.language === lang.code 
                      ? 'bg-[#00f3ff]/10 text-[#00f3ff] border border-[#00f3ff]/30 shadow-[0_0_15px_rgba(0,243,255,0.1)]' 
                      : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex flex-col items-start translate-x-0 group">
                    <span className="text-[11px] font-black uppercase tracking-[0.1em]">{lang.native}</span>
                    <span className="text-[10px] opacity-40 font-bold tracking-tight">{lang.name}</span>
                  </div>
                  {i18n.language === lang.code && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-1 rounded-full bg-[#00f3ff]/20">
                      <Check size={14} className="text-[#00f3ff]" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
            
            <div className="bg-black/60 px-4 py-2 text-[8px] font-black text-center text-white/20 uppercase tracking-[0.4em]">
              Synchronization Stable
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
