"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SmilePlus, Wind, Brain, Target, ArrowLeft } from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100 } }
};

export default function MoodBoosterPage() {
  const [activeGame, setActiveGame] = useState(null);
  const [breathingStep, setBreathingStep] = useState("Inhale");
  const [score, setScore] = useState(0);

  // Breathing Box logic
  useEffect(() => {
    let interval;
    if (activeGame === 'breathing') {
      const steps = ["Inhale", "Hold", "Exhale", "Hold"];
      let currentIdx = 0;
      setBreathingStep(steps[currentIdx]);
      interval = setInterval(() => {
        currentIdx = (currentIdx + 1) % steps.length;
        setBreathingStep(steps[currentIdx]);
      }, 4000); // 4 seconds per phase
    }
    return () => clearInterval(interval);
  }, [activeGame]);

  const [memoCards, setMemoCards] = useState([]);
  
  useEffect(() => {
    const cards = ["😀", "😀", "🐶", "🐶", "🌻", "🌻", "🍕", "🍕"];
    setMemoCards(
        cards.sort(() => Math.random() - 0.5).map((e, idx) => ({ id: idx, emoji: e, flipped: false, matched: false }))
    );
  }, []);
  
  const handleCardClick = (idx) => {
    if (memoCards[idx].flipped || memoCards[idx].matched) return;
    const newCards = [...memoCards];
    newCards[idx].flipped = true;
    setMemoCards(newCards);
    
    const flippedCards = newCards.filter(c => c.flipped && !c.matched);
    if (flippedCards.length === 2) {
      setTimeout(() => {
        if (flippedCards[0].emoji === flippedCards[1].emoji) {
          setMemoCards(newCards.map(c => c.emoji === flippedCards[0].emoji ? { ...c, matched: true } : c));
        } else {
          setMemoCards(newCards.map(c => !c.matched ? { ...c, flipped: false } : c));
        }
      }, 1000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 relative z-10 min-h-[calc(100vh-80px)] overflow-hidden">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8"
      >
        <div className="p-3 glass-panel rounded-2xl shadow-[0_0_15px_rgba(250,204,21,0.3)]">
          <SmilePlus className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-[#00f3ff]">
            Serotonin Override
          </h1>
          <p className="text-sm text-yellow-400/80 font-medium">Interactive protocols for cortisol reduction</p>
        </div>
      </motion.div>
      
      <AnimatePresence mode="wait">
      {!activeGame ? (
        <motion.div 
          key="menu"
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, scale: 0.95 }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Card 1 */}
          <motion.div 
            variants={cardVariants}
            onClick={() => setActiveGame('breathing')}
            className="cursor-pointer group flex flex-col justify-between p-8 glass-panel rounded-3xl border border-[#00f3ff]/20 shadow-lg hover:shadow-[0_0_30px_rgba(0,243,255,0.15)] hover:-translate-y-2 transition-all relative overflow-hidden h-64"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00f3ff]/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Wind className="w-12 h-12 text-[#00f3ff] mb-4 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(0,243,255,0.8)]" />
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">Breathing Protocol</h2>
              <p className="mt-2 text-sm text-gray-400 leading-relaxed font-medium text-balance">
                Synchronize neural patterns with a 4-7-8 breathing animation loop phase.
              </p>
            </div>
          </motion.div>
          
          {/* Card 2 */}
          <motion.div 
            variants={cardVariants}
            onClick={() => setActiveGame('memory')}
            className="cursor-pointer group flex flex-col justify-between p-8 glass-panel border border-[#4ade80]/20 rounded-3xl shadow-lg hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(74,222,128,0.15)] transition-all relative overflow-hidden h-64"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#4ade80]/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Brain className="w-12 h-12 text-[#4ade80] mb-4 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">Cognitive Match</h2>
              <p className="mt-2 text-sm text-gray-400 font-medium leading-relaxed">
                Train working memory and interrupt anxiety loops by finding positive pairs.
              </p>
            </div>
          </motion.div>
          
          {/* Card 3 */}
          <motion.div 
            variants={cardVariants}
            onClick={() => setActiveGame('smile')}
            className="cursor-pointer group flex flex-col justify-between p-8 glass-panel rounded-3xl shadow-lg hover:-translate-y-2 border border-[#facc15]/20 hover:shadow-[0_0_30px_rgba(250,204,21,0.15)] transition-all relative overflow-hidden h-64"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#facc15]/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Target className="w-12 h-12 text-[#facc15] mb-4 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">Target Engagement</h2>
              <p className="mt-2 text-sm text-gray-400 leading-relaxed font-medium">
                Rapid-fire motor skill task. Intercept the smiling entity to earn dopamine points.
              </p>
            </div>
          </motion.div>

        </motion.div>
      ) : (
        <motion.div 
          key="game"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <button 
            onClick={() => { setActiveGame(null); setScore(0); }} 
            className="px-6 py-3 border border-white/20 rounded-full hover:bg-white/10 hover:border-white/50 text-white font-bold tracking-widest uppercase text-xs flex gap-2 items-center transition-all bg-white/5 shadow-inner relative z-20"
          >
             <ArrowLeft size={16} /> Disconnect Protocol
          </button>
          

          {/* BREATHING GAME */}
          {activeGame === 'breathing' && (
            <div className="h-[500px] flex flex-col items-center justify-center glass-panel rounded-[32px] border border-[#00f3ff]/30 shadow-[0_0_40px_rgba(0,243,255,0.05)] relative overflow-hidden">
               {/* Background Ambient Pulses */}
              <motion.div 
                animate={{ 
                  scale: breathingStep === "Inhale" ? 1.5 : breathingStep === "Exhale" ? 0.8 : undefined,
                  opacity: breathingStep === "Hold" ? 0.8 : 0.4
                }}
                transition={{ duration: 4, ease: "easeInOut" }}
                className="absolute w-[400px] h-[400px] rounded-full bg-[#00f3ff]/10 blur-[100px] pointer-events-none"
              />
              <motion.div 
                animate={{ 
                  scale: breathingStep === "Inhale" ? 2.5 : breathingStep === "Exhale" ? 1 : undefined
                }}
                transition={{ duration: 4, ease: "easeInOut" }}
                className="w-40 h-40 rounded-full bg-gradient-to-br from-[#00f3ff] to-blue-500 shadow-[0_0_60px_rgba(0,243,255,0.8)] flex items-center justify-center font-black text-black tracking-widest text-2xl uppercase border-4 border-white z-10"
              >
                {breathingStep}
              </motion.div>
            </div>
          )}

          {/* MEMORY CARD GAME */}
          {activeGame === 'memory' && (
            <div className="glass-panel p-8 md:p-12 rounded-[32px] border border-[#4ade80]/30 shadow-[0_0_40px_rgba(74,222,128,0.05)] text-center">
              <div className="grid grid-cols-4 gap-4 md:gap-6 max-w-xl mx-auto">
                {memoCards.map((c, i) => (
                  <div 
                    key={i} 
                    onClick={() => handleCardClick(i)}
                    className={`aspect-square flex items-center justify-center text-4xl md:text-5xl rounded-3xl cursor-pointer transition-all duration-300 transform ${
                      c.flipped || c.matched 
                      ? 'bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)] rotate-y-180 border-2 border-white/50' 
                      : 'bg-white/10 hover:bg-white/20 border border-white/20 shadow-inner backdrop-blur-md'
                    }`}
                  >
                    {(c.flipped || c.matched) ? c.emoji : <Brain size={32} className="text-[#4ade80]/50" />}
                  </div>
                ))}
              </div>
              {memoCards.every(c => c.matched) && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-12 text-2xl font-black text-[#4ade80] drop-shadow-[0_0_10px_rgba(74,222,128,0.6)] tracking-wide uppercase"
                >
                  Neural Paths Synchronized! 🌟
                </motion.div>
              )}
            </div>
          )}
          
          {/* CLICK THE SMILE GAME */}
          {activeGame === 'smile' && (
            <div className="h-[500px] relative glass-panel rounded-[32px] border border-[#facc15]/30 shadow-[0_0_40px_rgba(250,204,21,0.05)] overflow-hidden text-center cursor-crosshair group">
              
              {/* Scanline background */}
              <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVQIW2NkYGD4z8DAwMgAI0AMDA4QAQM45VwAAAAASUVORK5CYII=')] opacity-20 pointer-events-none"></div>

              <div className="absolute top-6 left-6 text-2xl font-black text-[#facc15] drop-shadow-[0_0_10px_rgba(250,204,21,0.8)] flex flex-col items-start gap-1">
                <span className="text-[10px] text-white/50 tracking-widest uppercase">Target Intercepts</span>
                SCORE: {score}
              </div>
              
              <div className="absolute w-full h-full inset-0 pointer-events-none p-10 flex justify-center items-center">
                 <div className="w-1 h-1 bg-red-500 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              <motion.div 
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setScore(s => s + 10)}
                className="absolute text-6xl cursor-pointer drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] z-10"
                animate={{
                  x: [50, 600, 300, 100, 500, 50], 
                  y: [50, 300, 50, 400, 150, 50]
                }}
                transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
              >
                😊
              </motion.div>
              
              <div className="absolute bottom-6 left-0 w-full text-xs font-bold text-gray-500 uppercase tracking-widest px-4">
                Engage the moving target to override negative thought loops.
              </div>
            </div>
          )}
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
