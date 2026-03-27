"use client";
import Link from 'next/link';
import { Heart, MessageSquare, BookOpen, LayoutDashboard } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import '../lib/i18n';

export default function Navbar() {
  const { t } = useTranslation();
  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-black/50 border-b border-white/10">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-12">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="p-3 rounded-2xl bg-gradient-to-tr from-[#bc13fe] to-[#34d399] group-hover:shadow-[0_0_20px_rgba(188,19,254,0.5)] transition-all">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="font-black text-2xl tracking-tighter text-white uppercase italic">EMOAI <span className="text-[#00f3ff]">PRO</span></span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden md:flex gap-2">
              <NavLink href="/chat" icon={<MessageSquare className="w-4 h-4" />} text={t('common.chat')} />
              <NavLink href="/journal" icon={<BookOpen className="w-4 h-4" />} text={t('common.journal')} />
              <NavLink href="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} text={t('common.dashboard')} />
            </div>
            <div className="h-10 w-[1px] bg-white/10 hidden md:block"></div>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, icon, text }) {
  return (
    <Link href={href} className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-black uppercase tracking-widest text-zinc-300 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10">
      <span className="text-[#00f3ff]">{icon}</span>
      <span className="hidden lg:inline">{text}</span>
    </Link>
  );
}
