"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Mic, MicOff, AlertTriangle, User, Activity, Sparkles, BrainCircuit, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import '@/lib/i18n';
import SuggestionsPanel from '@/components/SuggestionsPanel';

export default function GeminiChatPage() {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  
  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);

  // Map i18n codes to Speech API codes
  const langMap = {
    'en': 'en-US',
    'ta': 'ta-IN',
    'hi': 'hi-IN',
    'ml': 'ml-IN',
    'te': 'te-IN',
    'kn': 'kn-IN'
  };

  // Initialize Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = langMap[i18n.language] || 'en-US';

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setInput(prev => prev + ' ' + finalTranscript);
        }
      };

      recognitionRef.current.onend = () => {
        if (isRecording) {
          recognitionRef.current.start();
        }
      };
    }
  }, [isRecording, i18n.language]);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      recognitionRef.current?.stop();
    } else {
      setIsRecording(true);
      recognitionRef.current?.start();
    }
  };

  const speakResponse = useCallback((text) => {
    if (!isVoiceEnabled || typeof window === 'undefined') return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langMap[i18n.language] || 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.1; // Slightly futuristic pitch
    utterance.volume = 1.0;
    
    // Select a pleasant voice if available matching language
    const voices = window.speechSynthesis.getVoices();
    const targetedLang = langMap[i18n.language] || 'en-US';
    const voice = voices.find(v => v.lang === targetedLang && (v.name.includes('Google') || v.name.includes('Premium'))) || 
                  voices.find(v => v.lang === targetedLang) ||
                  voices.find(v => v.name.includes('Google') || v.name.includes('Premium')) || 
                  voices[0];
                  
    if (voice) utterance.voice = voice;

    window.speechSynthesis.speak(utterance);
  }, [isVoiceEnabled, i18n.language]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') window.speechSynthesis.cancel();
    };
  }, []);

  const handleSend = async (messageText) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    const userMessage = { role: "user", content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: textToSend, 
          history: messages 
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        const botMessage = { role: "assistant", content: data.response };
        setMessages(prev => [...prev, botMessage]);
        setAnalysis(data);
        // Trigger voice response
        if (isVoiceEnabled) {
          speakResponse(data.response);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the Gemini AI API.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden font-sans relative z-10 pt-4">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-8 pb-4"
      >
        <div className="flex items-center gap-6">
          <div className="p-3 md:p-4 glass-panel rounded-2xl shadow-[0_0_20px_rgba(0,243,255,0.4)] border-[#00f3ff]/30">
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-[#00f3ff] drop-shadow-[0_0_10px_rgba(0,243,255,0.8)]" />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#00f3ff] via-white to-blue-400">
              Gemini Voice Chat
            </h1>
            <p className="text-xs md:text-base text-[#00f3ff] font-black uppercase tracking-widest mt-1">Neural Analysis Engine</p>
          </div>
        </div>
      </motion.div>

      <div className="max-w-[1800px] mx-auto w-full flex-1 flex flex-col md:flex-row p-4 gap-8 overflow-hidden">
        
        {/* Left Sidebar: Analysis & Suggestions */}
        <aside className="hidden md:flex flex-col w-1/3 gap-8 overflow-y-auto pr-2 custom-scrollbar">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-8 rounded-[32px] border-white/20 shadow-xl"
          >
            <h2 className="text-2xl font-black flex items-center gap-3 mb-8 text-white uppercase tracking-tight">
              <Activity className="text-[#00f3ff]" />
              Emotional Telemetry
            </h2>
            
            {/* Security Footnote */}
            <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 drop-shadow-md">
                <ShieldCheck size={12} className="text-[#00f3ff]" />
                Neural Uplink Secure • End-to-End Encrypted
            </div>
            
            <AnimatePresence mode="wait">
              {analysis ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/20">
                    <span className="text-sm text-white/60 font-black uppercase tracking-widest">Primary Emotion</span>
                    <span className="font-black text-[#00f3ff] text-lg uppercase tracking-wider drop-shadow-md">
                      {analysis.emotion}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/20">
                    <span className="text-sm text-white/60 font-black uppercase tracking-widest">Sentiment Core</span>
                    <span className={`font-black text-lg uppercase tracking-wider ${
                      analysis.sentiment === 'Positive' ? 'text-green-400' : 
                      analysis.sentiment === 'Negative' ? 'text-red-400' : 
                      'text-white'
                    }`}>
                      {analysis.sentiment}
                    </span>
                  </div>

                  <div className="space-y-3 p-4 bg-white/10 rounded-2xl border border-white/20">
                    <div className="flex justify-between text-sm font-black uppercase text-white/60 tracking-widest">
                      <span>Neural Stress</span>
                      <span className="text-white font-black">{analysis.stress_level}</span>
                    </div>
                    <div className="w-full bg-black/50 h-3 rounded-full overflow-hidden shadow-inner border border-white/10">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ 
                          width: analysis.stress_level === 'Low' ? '25%' : 
                                 analysis.stress_level === 'Medium' ? '50%' : 
                                 analysis.stress_level === 'High' ? '75%' : '100%' 
                        }}
                        className={`h-full shadow-[0_0_15px_currentColor] transition-all duration-500 ${
                          analysis.stress_level === 'Low' ? 'bg-green-400 shadow-green-400' : 
                          analysis.stress_level === 'Medium' ? 'bg-yellow-400 shadow-yellow-400' : 
                          analysis.stress_level === 'High' ? 'bg-orange-400 shadow-orange-400' : 'bg-red-500 shadow-red-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="mt-8 p-6 glass-panel rounded-3xl border-white/20">
                    <h3 className="text-sm font-black flex items-center gap-3 text-[#bc13fe] tracking-[0.2em] uppercase mb-4">
                      <BrainCircuit size={20} />
                      AI Optimization Strategy
                    </h3>
                    <p className="text-base text-white italic leading-relaxed font-bold">
                      "{analysis.suggestion}"
                    </p>
                  </div>

                  {analysis.crisis_flag && (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="mt-4 p-4 glass-panel border border-red-500/50 bg-red-900/30 rounded-2xl animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                    >
                      <p className="text-sm font-black text-red-400 flex items-center gap-2 drop-shadow-[0_0_8px_#f87171]">
                        <AlertTriangle size={16} />
                        SYSTEM OVERLOAD DETECTED
                      </p>
                      <p className="text-xs text-red-200 mt-2 font-medium">
                        Please reach out to biological support. National Crisis Hotline: 988.
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12 text-gray-500"
                >
                  <Activity className="w-16 h-16 mb-4 opacity-20" />
                  <p className="text-sm tracking-widest uppercase font-bold text-gray-600">Awaiting Data Stream...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-8 rounded-[32px] border-white/10 shadow-lg"
          >
            <h2 className="text-sm font-black text-white/40 uppercase tracking-[0.3em] mb-6">Diagnostic Pre-sets</h2>
            <div className="flex flex-wrap gap-3">
              {[
                "Neural pathways feel overloaded.",
                "How can I optimize stress reduction?",
                "Initialize breathing protocol.",
                "Cognitive function is peak today!"
              ].map((p, i) => (
                <button 
                    key={i} 
                    onClick={() => handleSend(p)}
                    className="text-sm py-3 px-6 rounded-2xl border border-white/10 hover:border-[#00f3ff]/50 bg-white/5 hover:bg-[#00f3ff]/10 hover:text-white text-white/60 transition-all font-black uppercase tracking-wider"
                >
                    {p}
                </button>
              ))}
            </div>
          </motion.div>
        </aside>

        {/* Main Chat Area */}
        <section className="flex-1 flex flex-col glass-panel rounded-[40px] overflow-hidden border-2 border-[#00f3ff]/40 shadow-[0_0_50px_rgba(0,243,255,0.1)] relative bg-black/40 rgb-border">
          
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/60 backdrop-blur-3xl z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00f3ff] to-[#bc13fe] flex items-center justify-center text-white text-2xl font-black shadow-[0_0_20px_rgba(0,243,255,0.5)]">
                G
              </div>
              <div>
                <h2 className="font-black text-2xl text-white leading-none mb-2 tracking-tight">Gemini AI</h2>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-green-400 shadow-[0_0_10px_#4ade80] rounded-full animate-pulse"></span>
                  <span className="text-xs uppercase font-black text-[#00f3ff] tracking-[0.2em]">Synchronization Stable</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setIsVoiceEnabled(!isVoiceEnabled);
                  if (isVoiceEnabled) window.speechSynthesis.cancel();
                }}
                className={`p-3 rounded-xl border-2 transition-all ${
                  isVoiceEnabled 
                    ? 'border-[#00f3ff]/50 bg-[#00f3ff]/10 text-[#00f3ff] shadow-[0_0_15px_rgba(0,243,255,0.3)]' 
                    : 'border-white/10 bg-white/5 text-white/40'
                }`}
                title={isVoiceEnabled ? "Mute Neural Voice" : "Enable Neural Voice"}
              >
                {isVoiceEnabled ? (
                  <div className="flex items-center gap-2">
                    <Mic className="animate-pulse" size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Voice ON</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <MicOff size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Voice OFF</span>
                  </div>
                )}
              </motion.button>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 cyber-scrollbar scroll-smooth relative"
          >
            <div className="absolute inset-0 bg-transparent flex justify-center items-center pointer-events-none opacity-[0.03]">
              <Sparkles className="w-96 h-96" />
            </div>

            {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-70">
                    <Sparkles className="w-16 h-16 text-[#00f3ff] drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]" />
                    <div className="max-w-xs">
                        <h3 className="font-bold text-xl text-white tracking-wide">System Online.</h3>
                        <p className="text-sm text-gray-400 mt-2">Voice and text protocols active. Awaiting your input.</p>
                    </div>
                </div>
            )}
            
            <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-[0_0_10px_currentColor] ${
                        m.role === 'user' ? 'bg-[#bc13fe] text-white shadow-[#bc13fe]' : 'bg-[#00f3ff] text-black shadow-[#00f3ff]'
                    }`}>
                        {m.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                    </div>
                    <div className={`p-5 md:p-6 rounded-3xl md:rounded-[2rem] border-2 shadow-2xl ${
                        m.role === 'user' 
                          ? 'bg-gradient-to-br from-[#bc13fe]/40 to-purple-600/20 border-[#bc13fe]/50 text-white rounded-br-sm backdrop-blur-xl' 
                          : 'glass-panel border-white/20 text-white rounded-bl-sm bg-white/5'
                    }`}>
                        <p className="text-base md:text-lg leading-relaxed select-text font-medium">{m.content}</p>
                    </div>
                </div>
              </motion.div>
            ))}
            </AnimatePresence>

            {analysis && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="pt-6 border-t border-white/5"
              >
                <SuggestionsPanel mood={analysis.emotion} showQuote />
              </motion.div>
            )}
            
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="flex justify-start items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-[#00f3ff] shadow-[0_0_10px_#00f3ff] flex items-center justify-center">
                    <Activity className="text-black animate-spin-slow" size={16} />
                </div>
                <div className="glass-panel border-white/10 p-4 rounded-3xl rounded-bl-sm flex gap-2 h-[52px] items-center">
                    <span className="w-2 h-2 bg-[#00f3ff] shadow-[0_0_8px_#00f3ff] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-[#00f3ff] shadow-[0_0_8px_#00f3ff] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-[#00f3ff] shadow-[0_0_8px_#00f3ff] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </motion.div>
            )}
            
            {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel border-red-500/50 bg-red-900/30 text-red-300 p-3 rounded-xl text-xs flex items-center justify-center gap-2 mx-auto max-w-sm">
                    <AlertTriangle size={14} className="text-red-400 drop-shadow-[0_0_8px_#f87171]" />
                    {error}
                </motion.div>
            )}
          </div>

          {/* Input Bar */}
          <div className="p-4 bg-gray-900/50 backdrop-blur-md border-t border-white/10">
            <div className="flex gap-3 items-center">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleRecording}
                  className={`p-4 rounded-2xl transition-all border ${
                      isRecording 
                        ? 'bg-red-500/20 border-red-500/50 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse' 
                        : 'glass-panel border-white/10 text-gray-400 hover:text-[#00f3ff] hover:border-[#00f3ff]/30 hover:shadow-[0_0_15px_rgba(0,243,255,0.2)]'
                  }`}
                >
                  {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
                </motion.button>
                <div className="relative flex-1">
                    <input 
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSend()}
                      placeholder={isRecording ? "Acoustic sensor active..." : "Initialize neural query..."}
                       className="w-full p-6 pr-20 rounded-[2rem] glass-panel border-2 border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#00f3ff] focus:shadow-[0_0_30px_rgba(0,243,255,0.3)] transition-all text-lg font-bold"
                    />
                    <button 
                      onClick={() => handleSend()}
                      disabled={!input.trim() || isLoading}
                      className="absolute right-2 top-2 p-2 neon-button rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Send size={18} />
                    </button>
                </div>
            </div>
            <p className="mt-2 text-[10px] text-center text-white/40 uppercase tracking-widest font-bold">
                End-to-End Encryption • Biometric Audio Safe
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
