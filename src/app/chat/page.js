"use client";
import { useState, useEffect, useRef } from 'react';
import { Send, Mic, AlertCircle, Bot, User, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [crisisAlert, setCrisisAlert] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Web Speech API for voice
  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => setIsListening(true);
      
      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setInput(prev => prev + (prev.length > 0 ? ' ' : '') + finalTranscript);
        }
      };

      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.start();
    } else {
      alert('Speech recognition not supported in this browser.');
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Check Crisis Phrase
    const crisisKeywords = ["suicide", "want to die", "hopeless", "kill myself"];
    if (crisisKeywords.some(w => input.toLowerCase().includes(w))) {
      setCrisisAlert(true);
      return; 
    }

    const newMessage = { role: "user", content: input };
    setMessages(prev => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: [...messages, newMessage] }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await resp.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.message }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] p-6 max-w-[1600px] mx-auto w-full relative z-10 pt-14 space-y-8">
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-6 mb-10"
      >
        <div className="p-4 glass-panel rounded-2xl shadow-[0_0_20px_rgba(251,113,133,0.4)] border-rose-500/30">
          <Bot className="w-10 h-10 text-rose-400 drop-shadow-[0_0_10px_rgba(251,113,133,0.8)]" />
        </div>
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-white to-[#bc13fe]">
            Empathy Core Chat
          </h1>
          <p className="text-xs md:text-base text-rose-400 font-black uppercase tracking-widest mt-1">Neural AI Assistant Online</p>
        </div>
      </motion.div>
      
      <AnimatePresence>
        {crisisAlert && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-panel border border-red-500/50 bg-red-900/20 p-6 mb-6 rounded-3xl relative overflow-hidden shadow-[0_0_30px_rgba(220,38,38,0.3)]"
          >
            <div className="absolute inset-0 bg-red-500/10 animate-pulse"></div>
            <div className="relative z-10">
              <p className="font-bold flex items-center gap-2 text-red-400 text-lg mb-2">
                <AlertCircle className="drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]" /> 
                CRISIS PROTOCOL ACTIVATED
              </p>
              <p className="text-red-200">Please remember you are not alone. Reach out to someone you trust, or call the National Suicide Prevention Lifeline at <strong className="text-white">988</strong>.</p>
              <button 
                onClick={() => setCrisisAlert(false)} 
                className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-full text-sm font-bold transition-all border border-red-500/30"
              >
                Acknowledge & Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat History Box */}
      <div className="flex-1 overflow-y-auto glass-panel border-2 border-[#bc13fe]/40 rounded-[2.5rem] p-8 space-y-8 mb-8 shadow-2xl cyber-scrollbar relative bg-black/40 rgb-border">
        {messages.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4"
          >
            <Bot className="w-16 h-16 text-rose-400/30" />
            <p className="font-medium tracking-wide">Secure connection established. I am here to listen.</p>
          </motion.div>
        )}
        
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`flex items-end gap-3 ${m.role === 'user' ? 'justify-end flex-row-reverse' : 'justify-start'}`}
            >
              {m.role === 'user' ? (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#bc13fe] to-[#00f3ff] flex-shrink-0 flex items-center justify-center shadow-[0_0_10px_rgba(188,19,254,0.5)]">
                  <User size={16} className="text-white" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-800/80 border border-rose-500/50 flex-shrink-0 flex items-center justify-center shadow-[0_0_10px_rgba(251,113,133,0.3)] backdrop-blur-md">
                  <Bot size={16} className="text-rose-400" />
                </div>
              )}
              
              <div className={`max-w-[85%] md:max-w-[70%] p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border-2 shadow-2xl ${
                m.role === 'user' 
                  ? 'bg-gradient-to-br from-[#bc13fe]/40 to-[#00f3ff]/20 border-[#bc13fe]/50 rounded-br-sm text-white backdrop-blur-md' 
                  : 'glass-panel border-white/20 rounded-bl-sm text-white bg-white/5 shadow-[0_0_20px_rgba(255,255,255,0.05)]'
              }`}>
                <p className="text-base md:text-xl leading-relaxed font-bold">{m.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-end gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-gray-800/80 border border-rose-500/50 flex-shrink-0 flex items-center justify-center shadow-[0_0_10px_rgba(251,113,133,0.3)]">
              <Bot size={16} className="text-rose-400" />
            </div>
            <div className="glass-panel border-gray-700/50 p-4 rounded-3xl rounded-bl-sm flex gap-2 items-center h-[52px]">
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 rounded-full bg-rose-400" />
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 rounded-full bg-rose-400" />
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 rounded-full bg-rose-400" />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex gap-3">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startListening} 
          className={`p-4 rounded-2xl flex items-center justify-center transition-all ${
            isListening 
              ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse' 
              : 'glass-panel text-gray-400 hover:text-[#00f3ff] hover:border-[#00f3ff]/30 hover:shadow-[0_0_15px_rgba(0,243,255,0.2)]'
          }`}
        >
          {isListening ? <Volume2 size={24} className="animate-bounce" /> : <Mic size={24} />}
        </motion.button>
        
        <div className="flex-1 relative">
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Initialize neural transmission..."
              className="w-full h-full p-6 pl-8 rounded-[2rem] glass-panel border-2 border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#bc13fe] focus:shadow-[0_0_30px_rgba(188,19,254,0.3)] transition-all text-lg font-bold"
            />
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend} 
          disabled={!input.trim() || loading}
          className="p-4 rounded-2xl neon-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <Send size={24} />
        </motion.button>
      </div>
    </div>
  );
}
