import Link from 'next/link';
import { ArrowRight, Brain, Heart, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"></div>
      
      <div className="animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-purple-300 mb-8 backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
          Your AI Mental Health Companion
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-300 to-white">
          MindMate AI
        </h1>
        
        <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Empathetic therapy chat, emotion tracking, and smart journaling. Completely free and secure, designed for your well-being.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/chat" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 font-semibold text-white hover:opacity-90 transition-opacity shadow-[0_0_30px_rgba(168,85,247,0.3)]">
            Start Therapy Chat <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/journal" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 font-semibold text-white transition-colors backdrop-blur-md">
            Open Journal
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-24 max-w-5xl">
        <FeatureCard 
          icon={<Brain className="w-6 h-6 text-purple-400" />}
          title="Empathetic AI Chat"
          desc="CBT & DBT guided conversations utilizing privacy-preserving AI models."
        />
        <FeatureCard 
          icon={<Heart className="w-6 h-6 text-pink-400" />}
          title="Emotion Detection"
          desc="Multimodal emotion tracking from text, voice, and facial expressions."
        />
        <FeatureCard 
          icon={<Shield className="w-6 h-6 text-emerald-400" />}
          title="Crisis Safety Engine"
          desc="Real-time detection for distress to provide grounding and safety resources."
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm hover:bg-white/[0.05] transition-colors text-left">
      <div className="p-3 bg-white/5 rounded-xl inline-block mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-zinc-400 leading-relaxed text-sm">
        {desc}
      </p>
    </div>
  );
}
