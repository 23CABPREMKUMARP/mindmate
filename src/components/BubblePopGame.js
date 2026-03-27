"use client";
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, Float, Text, Stars, Html, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, Clock, RefreshCcw } from 'lucide-react';
import DailyQuoteCard from './DailyQuoteCard';

const BUBBLE_WORDS = ["Calm", "Strong", "Happy", "Relax", "Focus", "Breathe", "Smile", "Believe", "Peace", "Joy"];
const BUBBLE_QUOTES = [
  "You are stronger than you think",
  "This moment will pass",
  "Breathe and start again",
  "Small steps matter",
  "You are doing your best",
  "Progress not perfection",
  "You got this",
  "Believe in yourself"
];
const BUBBLE_EMOJIS = ["😊", "😌", "🌿", "✨", "💙", "🌈", "🧠", "💪", "☀️", "🌊"];
const COLORS = ["#00f3ff", "#bc13fe", "#00ffcc", "#ff0055", "#ffaa00"];

const Bubble = ({ id, position, velocity, size, color, onPop }) => {
  const meshRef = useRef();
  const [popped, setPopped] = useState(false);
  const type = useMemo(() => {
     const rnd = Math.random();
     if (rnd > 0.9) return 'quote';
     if (rnd > 0.7) return 'emoji';
     if (rnd > 0.5) return 'bonus';
     return 'word';
  }, []);

  useFrame((state, delta) => {
    if (popped || !meshRef.current) return;
    
    meshRef.current.position.x += velocity.x * delta;
    meshRef.current.position.y += velocity.y * delta;
    meshRef.current.position.z += velocity.z * delta;

    // Bounce off bounds
    if (Math.abs(meshRef.current.position.x) > 5) velocity.x *= -1;
    if (Math.abs(meshRef.current.position.y) > 3) velocity.y *= -1;
    if (Math.abs(meshRef.current.position.z) > 2) velocity.z *= -1;

    // Wobble
    meshRef.current.rotation.x += delta * 0.5;
    meshRef.current.scale.setScalar(size + Math.sin(state.clock.elapsedTime * 2) * 0.05);
  });

  const handlePop = (e) => {
    e.stopPropagation();
    if (popped) return;
    setPopped(true);
    
    let content = "";
    let points = 10;
    
    if (type === 'quote') {
        content = BUBBLE_QUOTES[Math.floor(Math.random() * BUBBLE_QUOTES.length)];
        points = 50;
    } else if (type === 'emoji') {
        content = BUBBLE_EMOJIS[Math.floor(Math.random() * BUBBLE_EMOJIS.length)];
        points = 20;
    } else if (type === 'bonus') {
        content = "BONUS!";
        points = 100;
    } else {
        content = BUBBLE_WORDS[Math.floor(Math.random() * BUBBLE_WORDS.length)];
        points = 10;
    }

    if (meshRef.current) {
        onPop(id, points, meshRef.current.position.clone(), content, type);
    }
  };

  if (popped) return null;

  return (
    <Sphere 
        ref={meshRef} 
        position={position} 
        args={[1, 16, 16]} 
        onClick={handlePop}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'default')}
    >
      <meshPhysicalMaterial 
        color={type === 'bonus' ? '#facc15' : color} 
        emissive={type === 'bonus' ? '#facc15' : color}
        emissiveIntensity={0.8}
        transmission={0.9} 
        thickness={0.5} 
        roughness={0} 
        metalness={0.1}
        transparent
        opacity={0.6}
      />
    </Sphere>
  );
};

const PopText = ({ position, text, color }) => {
    const ref = useRef();
    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.position.y += delta * 1.5;
            ref.current.material.opacity -= delta * 0.5;
        }
    });

    return (
        <Text
            ref={ref}
            position={position}
            fontSize={0.4}
            color={color}
            font="/fonts/Geist-Black.woff" // fallback to default if not exists
            maxWidth={4}
            textAlign="center"
        >
            {text}
        </Text>
    );
};

export default function BubblePopGame() {
  const [gameState, setGameState] = useState('start'); // start, playing, gameover
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [bubbles, setBubbles] = useState([]);
  const [popEvents, setPopEvents] = useState([]);
  const [highScore, setHighScore] = useState(0);
  const nextId = useRef(0);

  useEffect(() => {
    const saved = localStorage.getItem('bubble_high_score');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const spawnBubble = () => {
    const id = nextId.current++;
    const newBubble = {
      id,
      position: [Math.random() * 8 - 4, Math.random() * 4 - 2, Math.random() * 2 - 1],
      velocity: {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
        z: (Math.random() - 0.5) * 1
      },
      size: 0.3 + Math.random() * 0.4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    };
    setBubbles(prev => [...prev.slice(-20), newBubble]);
  };

  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const spawnInterval = setInterval(() => {
      if (bubbles.length < 15) spawnBubble();
    }, 1000);

    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('gameover');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(timerInterval);
    };
  }, [gameState, bubbles]);

  const handlePop = (id, points, pos, content, type) => {
    setScore(s => s + points);
    setBubbles(prev => prev.filter(b => b.id !== id));
    
    const event = { id: Date.now(), pos, content, color: type === 'bonus' ? '#facc15' : '#00f3ff' };
    setPopEvents(prev => [...prev, event]);
    setTimeout(() => {
        setPopEvents(prev => prev.filter(e => e.id !== event.id));
    }, 2000);

    // Play "pop" sound effect (simulated with aura/vibe)
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setBubbles([]);
    setPopEvents([]);
    setGameState('playing');
    for (let i = 0; i < 8; i++) spawnBubble();
  };

  useEffect(() => {
    if (gameState === 'gameover' && score > highScore) {
        setHighScore(score);
        localStorage.setItem('bubble_high_score', score.toString());
    }
  }, [gameState, score, highScore]);

  return (
    <div className="w-full h-full relative group">
      <Canvas dpr={[1, 2]} gl={{ antialias: false, powerPreference: "high-performance" }}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00f3ff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#bc13fe" />
        
        <Stars radius={100} depth={50} count={800} factor={4} saturation={1} fade speed={1} />
        
        {bubbles.map(b => (
          <Bubble key={b.id} {...b} onPop={handlePop} />
        ))}

        {popEvents.map(e => (
          <PopText key={e.id} position={e.pos} text={e.content} color={e.color} />
        ))}

        {/* Rig for mouse parallax */}
        <Rig />
      </Canvas>

      {/* UI OVERLAYS */}
      <div className="absolute inset-x-0 top-6 px-10 flex justify-between items-start pointer-events-none z-20">
        <div className="flex flex-col gap-2">
            <div className="glass-panel p-4 rounded-2xl flex items-center gap-4 border border-white/10">
                <div className="p-2 bg-gradient-to-br from-[#bc13fe] to-[#00f3ff] rounded-lg">
                    <Trophy className="text-white w-5 h-5" />
                </div>
                <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none mb-1">Dopamine Score</p>
                    <p className="text-2xl font-black text-white leading-none">{score}</p>
                </div>
            </div>
            {highScore > 0 && (
                <div className="text-[10px] text-[#00f3ff] font-bold uppercase tracking-tight ml-2">High Score: {highScore}</div>
            )}
        </div>

        <div className="glass-panel p-4 rounded-2xl flex items-center gap-4 border border-white/10">
            <Clock className={`w-5 h-5 ${timeLeft < 10 ? 'text-rose-500 animate-pulse' : 'text-[#00f3ff]'}`} />
            <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Time Sync</p>
                <p className={`text-2xl font-black leading-none ${timeLeft < 10 ? 'text-rose-500' : 'text-white'}`}>{timeLeft}s</p>
            </div>
        </div>
      </div>

      <AnimatePresence>
        {gameState === 'start' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#02000f]/80 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center z-30"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <Sparkles className="w-16 h-16 text-[#00f3ff] mb-6 drop-shadow-[0_0_15px_rgba(0,243,255,0.6)]" />
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter uppercase italic">
              Bubble Pop <span className="rgb-text">Relax</span>
            </h1>
            <p className="text-gray-400 max-w-sm mb-10 font-medium tracking-wide">
              Click the floating 3D bubbles to release positive reinforcements. 
              Golden bubbles grant maximum dopamine.
            </p>
            <button 
              onClick={startGame}
              className="px-10 py-5 neon-button rounded-2xl text-lg font-black uppercase tracking-widest shadow-[0_0_20px_rgba(0,243,255,0.4)]"
            >
              Initialize Session
            </button>
          </motion.div>
        )}

        {gameState === 'gameover' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-[#02000f]/90 backdrop-blur-2xl flex flex-col items-center justify-center p-8 text-center z-30"
          >
            <h2 className="text-5xl font-black text-white mb-2 tracking-tighter uppercase italic">Session Complete</h2>
            <p className="text-[#00f3ff] font-bold tracking-[0.2em] mb-8 uppercase text-xs">Aura Data Synchronized</p>
            
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-12">
                <div className="glass-panel p-6 rounded-3xl border border-white/10">
                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">Final Score</p>
                    <p className="text-3xl font-black text-white">{score}</p>
                </div>
                <div className="glass-panel p-6 rounded-3xl border border-white/10">
                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">High Score</p>
                    <p className="text-3xl font-black text-[#bc13fe]">{highScore}</p>
                </div>
            </div>

            <div className="mb-10 max-w-xs mx-auto">
                <DailyQuoteCard variant="simple" />
            </div>

            <button 
              onClick={startGame}
              className="flex items-center gap-3 px-10 py-5 neon-button rounded-2xl text-lg font-black uppercase tracking-widest"
            >
              <RefreshCcw size={22} /> Re-Sync
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Internal Camera Rig for parallax
function Rig() {
    const { camera, mouse } = useThree();
    useFrame(() => {
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 1, 0.05);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.y * 1, 0.05);
        camera.lookAt(0, 0, 0);
    });
    return null;
}
