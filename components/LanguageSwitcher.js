"use client";
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check } from 'lucide-react';
import '../lib/i18n'; // Force init on client

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' }
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 glass-panel rounded-xl border border-white/10 hover:border-[#00f3ff]/40 transition-all group"
      >
        <Globe className="w-4 h-4 text-[#00f3ff] group-hover:rotate-180 transition-transform duration-700" />
        <span className="text-xs font-black uppercase tracking-widest text-white/80">
          {currentLang.native}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-48 glass-panel rounded-2xl border border-white/10 shadow-2xl backdrop-blur-3xl overflow-hidden z-[100]"
          >
            <div className="p-2 space-y-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    i18n.language === lang.code 
                      ? 'bg-[#00f3ff]/10 text-[#00f3ff]' 
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex flex-col items-start translate-x-0 group">
                    <span className="text-xs font-black uppercase tracking-widest">{lang.native}</span>
                    <span className="text-[10px] opacity-40 font-bold">{lang.name}</span>
                  </div>
                  {i18n.language === lang.code && (
                    <Check size={14} className="text-[#00f3ff]" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
