'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Mic, Send, StopCircle, RefreshCw, AlertTriangle } from 'lucide-react';

export default function ChatUI() {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([{ 
    role: 'assistant', 
    content: t('chat.status_typing') === 'chat.status_typing' ? 'Hi there, I am here to listen. How are you feeling today?' : t('chat.subtitle') 
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [crisisMode, setCrisisMode] = useState(false);
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        // Sync language with i18n
        const langMap = {
          en: 'en-US',
          ta: 'ta-IN',
          ml: 'ml-IN',
          hi: 'hi-IN'
        };
        recognitionRef.current.lang = langMap[i18n.language] || 'en-US';

        recognitionRef.current.onresult = (event) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setInput(currentTranscript);
        };

        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
        };
      }
    }
  }, [i18n.language]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      setInput('');
      recognitionRef.current?.start();
    }
    setIsRecording(!isRecording);
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setIsRecording(false);
    if(recognitionRef.current) recognitionRef.current.stop();

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage, 
          history: messages,
          lang: i18n.language 
        }),
      });
      const data = await response.json();
      
      if (data.crisisDetected) {
        setCrisisMode(true);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900/40 overflow-hidden">
      {crisisMode && (
        <div className="bg-red-500/20 border-b border-red-500/50 p-6 flex items-center gap-4 text-red-100">
          <AlertTriangle className="w-8 h-8 shrink-0 text-red-500" />
          <p className="text-sm font-bold uppercase tracking-widest">
            {t('common.neural_sync')} Issue: 1-800-273-8255 • Text HOME to 741741
          </p>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-[32px] p-6 shadow-2xl ${msg.role === 'user' ? 'bg-gradient-to-br from-[#bc13fe] to-purple-800 text-white rounded-tr-sm' : 'glass-panel text-white rounded-tl-sm border border-white/10'}`}>
              <p className="whitespace-pre-wrap text-[17px] leading-relaxed font-medium">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="glass-panel border border-white/10 rounded-[32px] rounded-tl-sm p-6 flex items-center gap-4">
              <RefreshCw className="w-6 h-6 animate-spin text-[#00f3ff]" />
              <span className="text-sm font-black uppercase tracking-widest text-[#00f3ff]">{t('common.loading')}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-8 bg-black/60 border-t border-white/10 backdrop-blur-2xl">
        <form onSubmit={handleSend} className="flex gap-4 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isRecording ? t('chat.listening') : t('chat.placeholder')}
            className="flex-1 bg-white/5 border-2 border-white/10 rounded-3xl px-8 py-5 text-white placeholder-white/20 focus:outline-none focus:border-[#00f3ff] focus:ring-4 focus:ring-[#00f3ff]/10 transition-all font-bold text-lg"
            disabled={loading}
          />
          <button
            type="button"
            onClick={toggleRecording}
            className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all border-2 ${isRecording ? 'bg-red-500/20 border-red-500/50 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse' : 'bg-white/5 border-white/10 text-white/40 hover:text-[#00f3ff] hover:border-[#00f3ff]'}`}
          >
            {isRecording ? <StopCircle size={28} /> : <Mic size={28} />}
          </button>
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-16 h-16 rounded-3xl bg-[#00f3ff]/20 border-2 border-[#00f3ff]/50 text-[#00f3ff] hover:bg-[#00f3ff] hover:text-black shadow-[0_0_20px_rgba(0,243,255,0.2)] disabled:opacity-20 transition-all flex items-center justify-center"
          >
            <Send size={28} />
          </button>
        </form>
      </div>
    </div>
  );
}
