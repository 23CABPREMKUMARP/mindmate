"use client";
import React, { useState, useCallback, useEffect } from 'react';
import FaceAuthCamera from '@/components/FaceAuthCamera';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShieldCheck, Camera, LogIn, UserPlus, Activity, ScanFace } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';
import DailyQuoteCard from '@/components/DailyQuoteCard';
import { useTranslation } from 'react-i18next';
import '@/lib/i18n';

export default function LoginPage() {
  const { t } = useTranslation();
  const [descriptor, setDescriptor] = useState(null);
  const [userName, setUserName] = useState('');
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [status, setStatus] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [faceLocked, setFaceLocked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('mindmate_user');
    if (user) {
        router.push('/');
    }
  }, [router]);

  const handleDetected = useCallback((data) => {
    if (data?.descriptor) {
      setDescriptor(data.descriptor);
      setFaceLocked(!!data.faceLocked);
    }
  }, []);

  const handleRegister = async () => {
    if (!userName || !descriptor) {
        setStatus(t('common.error'));
        return;
    }
    setStatus(t('common.loading'));
    try {
      const res = await fetch('/api/register-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userName, descriptor: Array.isArray(descriptor) ? descriptor : Array.from(descriptor) })
      });
      const json = await res.json();
      if (json.success) {
          setStatus(t('common.success'));
          setIsSuccess(true);
          localStorage.setItem('mindmate_user', JSON.stringify(json.user));
          setTimeout(() => router.push('/'), 1500);
      } else {
          setStatus(t('common.error'));
      }
    } catch (err) {
      setStatus(t('common.error'));
    }
  };

  const handleLogin = async () => {
    if (!descriptor) {
        setStatus(t('common.loading'));
        return;
    }
    setStatus(t('common.loading'));
    try {
      const res = await fetch('/api/recognize-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descriptor: Array.isArray(descriptor) ? descriptor : Array.from(descriptor) })
      });
      const json = await res.json();
      if (json.match) {
        setStatus(`${t('common.success')}, ${json.match.name}`);
        setIsSuccess(true);
        localStorage.setItem('mindmate_user', JSON.stringify(json.match));
        setTimeout(() => router.push('/'), 1500);
      } else {
        setStatus(json.message || t('common.error'));
      }
    } catch (err) {
        setStatus(t('common.error'));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans bg-[#02000f]">
      
      <div className="absolute inset-0 z-0">
        <AnimatedBackground />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#02000f] z-0 pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
      >
        <div className="space-y-8">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-tr from-[#00f3ff] to-[#bc13fe] rounded-2xl shadow-[0_0_20px_rgba(0,243,255,0.4)] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none"></div>
                    <ShieldCheck className="text-white w-8 h-8 relative z-10" />
                </div>
                <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                    NEUROCORE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f3ff] to-blue-400 not-italic drop-shadow-[0_0_5px_#00f3ff]">SECURE</span>
                </h1>
            </div>

            <div className="space-y-4 md:space-y-6">
                <h2 className="text-3xl md:text-6xl font-black tracking-tight text-white leading-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                    {t('auth.login_title')}.
                </h2>
                <p className="text-base md:text-lg text-gray-400 max-w-md font-medium tracking-wide">
                    {t('auth.login_subtitle')}
                </p>
            </div>

            <div className="flex flex-col gap-4">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-4 p-5 glass-panel rounded-2xl shadow-[0_0_20px_rgba(0,243,255,0.05)] border border-[#00f3ff]/20"
                >
                    <div className="p-2 bg-[#00f3ff]/10 rounded-lg border border-[#00f3ff]/30">
                        <ScanFace className="w-6 h-6 text-[#00f3ff] drop-shadow-[0_0_8px_#00f3ff]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white uppercase tracking-widest">{t('emotions.title')}</p>
                      <p className="text-xs text-white/40 font-medium">128-point vector tracking</p>
                    </div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-4 p-5 glass-panel border border-[#bc13fe]/20 rounded-2xl shadow-[0_0_20px_rgba(188,19,254,0.05)]"
                >
                    <div className="p-2 bg-[#bc13fe]/10 rounded-lg border border-[#bc13fe]/30">
                        <Activity className="w-6 h-6 text-[#bc13fe] drop-shadow-[0_0_8px_#bc13fe]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white uppercase tracking-widest">Cognitive State Encryption</p>
                      <p className="text-xs text-white/40 font-medium">Zero-knowledge data logging</p>
                    </div>
                </motion.div>
            </div>
        </div>

        <div className="relative group perspective-[1000px]">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00f3ff] to-[#bc13fe] rounded-[40px] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            
            <motion.div 
              style={{ rotateY: mode === 'login' ? 0 : 5, rotateX: mode === 'login' ? 0 : 2 }}
              className="relative glass-panel p-8 md:p-10 rounded-[36px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col items-center backdrop-blur-3xl transition-transform duration-700"
            >
                <div className={`relative w-full aspect-square max-w-[240px] md:max-w-[300px] rounded-[32px] overflow-hidden shadow-inner bg-black/50 backdrop-blur-sm transition-all duration-500 border-2 ${
                  faceLocked ? 'border-[#4ade80] shadow-[0_0_30px_rgba(74,222,128,0.4)]' : descriptor ? 'border-[#00f3ff] shadow-[0_0_30px_rgba(0,243,255,0.2)]' : 'border-white/10'
                }`}>
                   <div className="w-full h-full opacity-80 mix-blend-screen">
                        <FaceAuthCamera onDetected={handleDetected} />
                   </div>
                   
                   <div className="absolute inset-0 border-[15px] border-black/40 pointer-events-none rounded-[32px]"></div>
                   
                   <AnimatePresence>
                     {!faceLocked && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0"
                        >
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-[#00f3ff]/50 rounded-full animate-pulse pointer-events-none blur-[1px]"></div>
                          <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00f3ff] shadow-[0_0_20px_#00f3ff] animate-[scanVertical_3s_ease-in-out_infinite] opacity-60"></div>
                        </motion.div>
                     )}
                   </AnimatePresence>
                   
                   {/* Face Status HUD */}
                   <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-black transition-all border backdrop-blur-md whitespace-nowrap ${
                     faceLocked 
                       ? 'bg-[#4ade80]/20 text-[#4ade80] border-[#4ade80]/50 shadow-[0_0_15px_#4ade80]' 
                       : descriptor 
                         ? 'bg-[#00f3ff]/20 text-[#00f3ff] border-[#00f3ff]/50 shadow-[0_0_10px_#00f3ff]' 
                         : 'bg-black/80 text-white/40 border-white/10'
                   }`}>
                     {faceLocked ? '✓ BIOMETRIC LOCK' : descriptor ? '⟳ INITIALIZING...' : '⬤ AWAITING INPUT...'}
                   </div>
                </div>

                <div className="mt-8 w-full space-y-6">
                    <AnimatePresence mode="wait">
                        {mode === 'login' ? (
                            <motion.div 
                                key="login"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-white tracking-widest uppercase">{t('auth.face_login')}</h3>
                                    <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-1">ALIGN FACE WITH SENSOR</p>
                                </div>
                                <motion.button
                                    whileHover={faceLocked ? { scale: 1.02, boxShadow: "0 0 30px rgba(0,243,255,0.4)" } : {}}
                                    whileTap={faceLocked ? { scale: 0.98 } : {}}
                                    onClick={handleLogin}
                                    disabled={!faceLocked || isSuccess}
                                    className={`w-full py-4 text-white rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed border ${
                                      faceLocked 
                                        ? 'bg-[#00f3ff]/10 border-[#00f3ff]/50 shadow-[0_0_20px_rgba(0,243,255,0.2)] text-[#00f3ff]' 
                                        : 'bg-white/5 border-white/10 text-white/20'
                                    }`}
                                >
                                    {faceLocked ? (
                                      <>
                                        <LogIn size={18} /> {t('auth.btn_login')}
                                      </>
                                    ) : (
                                      'AWAITING LOCK...'
                                    )}
                                </motion.button>
                                <p className="text-center text-xs text-white/60 font-black uppercase tracking-widest mt-4">
                                    {t('auth.no_account')} <button onClick={() => setMode('register')} className="text-[#00f3ff] hover:text-white transition-colors ml-1 underline decoration-[#00f3ff]/30 underline-offset-4">{t('auth.btn_register')}</button>
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="register"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-white tracking-widest uppercase">{t('auth.register_title')}</h3>
                                    <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-1">ENROLL BIOMETRIC SIGNATURE</p>
                                </div>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#bc13fe] transition-colors" size={18} />
                                    <input 
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        placeholder={t('auth.username')}
                                        className="w-full p-4 pl-12 bg-black/60 border border-white/20 rounded-2xl focus:outline-none focus:border-[#bc13fe] focus:bg-[#bc13fe]/10 focus:shadow-[0_0_20px_rgba(188,19,254,0.3)] transition-all text-white placeholder-white/40 text-xs font-black tracking-widest uppercase mb-2"
                                    />
                                </div>
                                <motion.button
                                    whileHover={(faceLocked && userName) ? { scale: 1.02, boxShadow: "0 0 30px rgba(188,19,254,0.4)" } : {}}
                                    whileTap={(faceLocked && userName) ? { scale: 0.98 } : {}}
                                    onClick={handleRegister}
                                    disabled={!faceLocked || !userName || isSuccess}
                                    className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed border ${
                                      (faceLocked && userName)
                                        ? 'bg-[#bc13fe]/10 border-[#bc13fe]/50 text-[#bc13fe] shadow-[0_0_20px_rgba(188,19,254,0.2)]'
                                        : 'bg-white/5 border-white/10 text-white/20'
                                    }`}
                                >
                                    {faceLocked && userName ? (
                                      <>
                                        <UserPlus size={18} /> {t('auth.btn_register')}
                                      </>
                                    ) : (
                                      'AWAITING REQUISITES...'
                                    )}
                                </motion.button>
                                <p className="text-center text-xs text-gray-500 font-bold uppercase tracking-widest mt-4">
                                    {t('auth.already_account')} <button onClick={() => setMode('login')} className="text-[#bc13fe] hover:text-white transition-colors ml-1">{t('common.back')}</button>
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {status && (
                          <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className={`p-3 rounded-xl text-center text-[10px] font-black uppercase tracking-widest border backdrop-blur-md ${
                                  isSuccess 
                                      ? 'bg-green-500/10 text-green-400 border-green-500/30 shadow-[0_0_15px_rgba(74,222,128,0.2)]' 
                                      : 'bg-[#00f3ff]/10 text-[#00f3ff] border-[#00f3ff]/30 shadow-[0_0_15px_rgba(0,243,255,0.2)]'
                              }`}
                          >
                              {status}
                          </motion.div>
                      )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
      </motion.div>

      <div className="mt-12 z-10 max-w-sm w-full opacity-60 hover:opacity-100 transition-opacity">
          <DailyQuoteCard variant="simple" />
      </div>

      <style jsx global>{`
        @keyframes scanVertical {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 0.6; }
          50% { opacity: 0.8; }
          90% { opacity: 0.6; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
