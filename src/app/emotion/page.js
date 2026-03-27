"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanFace, Activity, CheckCircle2, AlertTriangle, Save } from 'lucide-react';
import WebcamEmotion from '@/components/WebcamEmotion';
import SuggestionsPanel from '@/components/SuggestionsPanel';
import MoodVisualizer from '@/components/MoodVisualizer';
import { useTranslation } from 'react-i18next';

export default function EmotionPage() {
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const { t } = useTranslation();

  const handleEmotionDetected = (emotionResult) => {
    setCurrentEmotion(emotionResult);
  };

  const handleSaveToDatabase = async () => {
    if (!currentEmotion) return;
    setIsSaving(true);
    setSaveStatus(t('common.loading'));
    try {
      const res = await fetch('/api/emotion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emotion_type: currentEmotion.type,
          score: currentEmotion.score
        }),
      });
      if (res.ok) {
        setSaveStatus(t('common.success'));
        setTimeout(() => setSaveStatus(""), 3000);
      } else {
        setSaveStatus(t('common.error'));
      }
    } catch (error) {
      setSaveStatus(t('common.error'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-[1800px] mx-auto p-4 md:p-12 space-y-8 md:space-y-12 relative z-10 min-h-[calc(100vh-80px)] overflow-hidden">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 md:gap-6 mb-6 md:mb-12"
      >
        <div className="p-3 glass-panel rounded-2xl shadow-[0_0_20px_rgba(188,19,254,0.4)] border border-[#bc13fe]/30">
          <ScanFace className="w-8 h-8 md:w-10 md:h-10 text-[#bc13fe] drop-shadow-[0_0_10px_rgba(188,19,254,0.8)] animate-pulse" />
        </div>
        <div>
          <h1 className="text-2xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#bc13fe] via-white to-[#00f3ff]">
            {t('emotions.title')}
          </h1>
          <p className="text-xs md:text-base text-[#bc13fe] font-black uppercase tracking-widest mt-1">{t('emotions.subtitle')}</p>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Scanner Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 glass-panel p-4 md:p-6 rounded-[32px] border border-[#00f3ff]/20 shadow-[0_0_40px_rgba(0,243,255,0.05)] relative overflow-hidden group"
        >
          {/* Mood Visualizer Overlay */}
          <MoodVisualizer mood={currentEmotion?.type} />

          {/* Scanning Line Animation */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00f3ff] to-transparent shadow-[0_0_20px_rgba(0,243,255,1)] opacity-50 z-20 pointer-events-none animate-[scanVertical_3s_ease-in-out_infinite]"></div>

          <div className="relative z-10 rounded-2xl overflow-hidden border-2 border-dashed border-[#00f3ff]/30 group-hover:border-[#00f3ff]/60 transition-colors">
            <WebcamEmotion onEmotionDetected={handleEmotionDetected} />
          </div>
          
          <div className="mt-4 flex justify-between items-center px-2 relative z-30">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00f3ff] shadow-[0_0_8px_#00f3ff] animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#00f3ff]">{t('emotions.scanning')}</span>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                PRIVACY SECURED • END-TO-END
            </div>
          </div>
        </motion.div>

        {/* Telemetry Output */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1 space-y-6 flex flex-col"
        >
          <div className="glass-panel p-6 rounded-3xl border border-[#bc13fe]/20 shadow-[0_0_30px_rgba(188,19,254,0.05)] flex-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#bc13fe]/5 to-transparent pointer-events-none"></div>
            
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2 mb-6">
              <Activity size={16} className="text-[#bc13fe]" /> {t('dashboard.status')}
            </h2>
            
            {currentEmotion ? (
              <div className="space-y-6 relative z-10">
                <div className="text-center p-4 md:p-6 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{t('emotions.detected')}</p>
                  <p className="text-3xl md:text-4xl font-black capitalize text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    {currentEmotion.type === 'happy' ? `😊 ${t('emotions.happy')}` :
                     currentEmotion.type === 'sad' ? `😢 ${t('emotions.sad')}` :
                     currentEmotion.type === 'angry' ? `😠 ${t('emotions.angry')}` :
                     currentEmotion.type === 'fear' ? `😨 ${t('emotions.fear')}` :
                     currentEmotion.type === 'surprise' ? `😲 ${t('emotions.surprised')}` :
                     currentEmotion.type === 'neutral' ? `😐 ${t('emotions.neutral')}` :
                     currentEmotion.type}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                    <span>Confidence Score</span>
                    <span className="text-[#00f3ff] drop-shadow-[0_0_5px_#00f3ff]">{(currentEmotion.score * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-900/50 h-2 rounded-full overflow-hidden border border-white/5 shadow-inner">
                    <motion.div 
                      key={currentEmotion.score}
                      initial={{ width: 0 }}
                      animate={{ width: `${currentEmotion.score * 100}%` }}
                      transition={{ type: "spring", stiffness: 100 }}
                      className="h-full bg-[#00f3ff] shadow-[0_0_10px_#00f3ff]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-40 flex flex-col items-center justify-center text-center opacity-50 relative z-10">
                <ScanFace className="w-12 h-12 mb-3 text-gray-500" />
                <p className="text-xs font-bold uppercase tracking-widest">{t('emotions.scanning')}</p>
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveToDatabase}
            disabled={!currentEmotion || isSaving}
            className="w-full p-4 neon-button rounded-2xl font-black tracking-widest uppercase flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:animation-none border border-[#bc13fe]/50"
          >
            {isSaving ? <Activity className="animate-spin" /> : <Save />}
            {isSaving ? t('common.loading') : t('journal.btn_save')}
          </motion.button>

          <AnimatePresence>
            {saveStatus && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-xl text-center text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 border ${
                  saveStatus === t('common.success')
                    ? 'bg-green-500/10 border-green-500/30 text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.2)]'
                    : 'bg-[#00f3ff]/10 border-[#00f3ff]/30 text-[#00f3ff] shadow-[0_0_15px_rgba(0,243,255,0.2)]'
                }`}
              >
                {saveStatus === t('common.success') ? <CheckCircle2 size={16} /> : <Activity size={16} className="animate-spin" />}
                {saveStatus}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {currentEmotion && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <SuggestionsPanel mood={currentEmotion.type} showQuote />
          </motion.div>
        )}
      </AnimatePresence>
      
      <style jsx global>{`
        @keyframes scanVertical {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 0.5; }
          50% { opacity: 1; }
          90% { opacity: 0.5; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
