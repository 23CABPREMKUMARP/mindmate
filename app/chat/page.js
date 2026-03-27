'use client';

import { useTranslation } from 'react-i18next';
import ChatUI from '@/components/ChatUI';
import '../../src/lib/i18n';

export default function ChatPage() {
  const { t } = useTranslation();
  
  return (
    <div className="max-w-6xl mx-auto py-16 px-8 h-[calc(100vh-80px)] mt-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#bc13fe] via-white to-[#00f3ff] tracking-tighter uppercase italic">
          {t('chat.title')}
        </h1>
        <p className="text-[#00f3ff] mt-4 font-black uppercase tracking-widest text-xs">{t('chat.subtitle')}</p>
      </div>
      <div className="h-[750px] glass-panel rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden group p-1">
        <ChatUI />
      </div>
    </div>
  );
}
