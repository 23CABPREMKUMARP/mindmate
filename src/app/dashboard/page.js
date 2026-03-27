"use client";
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  BookOpen, 
  ScanFace, 
  TrendingUp, 
  Sparkles, 
  BrainCircuit, 
  CalendarDays, 
  PieChart as PieChartIcon, 
  BarChart as BarChartIcon,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, Cell, PieChart, Pie, AreaChart, Area 
} from 'recharts';
import SuggestionsPanel from '@/components/SuggestionsPanel';
import DailyQuoteCard from '@/components/DailyQuoteCard';
import { aggregateMoodData, calculateStabilityScore } from '@/lib/moodUtils';
import { useTranslation } from 'react-i18next';
import '@/lib/i18n';

const COLORS = ['#00f3ff', '#bc13fe', '#00ffcc', '#ff0055', '#ffaa00', '#facc15'];

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100 } }
};

export default function DashboardPage() {
  const { t } = useTranslation();
  const [journals, setJournals] = useState([]);
  const [emotionLogs, setEmotionLogs] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    Promise.all([fetchJournals(), fetchEmotions()]).then(() => setIsLoaded(true));
  }, []);

  const fetchJournals = async () => {
    try {
      const res = await fetch('/api/journal');
      const data = await res.json();
      if (data.journals) setJournals(data.journals);
    } catch (e) {}
  };

  const fetchEmotions = async () => {
    try {
      const res = await fetch('/api/emotion');
      const data = await res.json();
      if (data.logs) setEmotionLogs(data.logs);
    } catch (e) {}
  };

  const MOCK_DATA = {
      timeline: [
          { date: new Date(Date.now() - 6 * 86400000).toISOString(), score: 3 },
          { date: new Date(Date.now() - 5 * 86400000).toISOString(), score: 4 },
          { date: new Date(Date.now() - 4 * 86400000).toISOString(), score: 3 },
          { date: new Date(Date.now() - 3 * 86400000).toISOString(), score: 5 },
          { date: new Date(Date.now() - 2 * 86400000).toISOString(), score: 4 },
          { date: new Date(Date.now() - 1 * 86400000).toISOString(), score: 4 },
          { date: new Date().toISOString(), score: 5 },
      ],
      dayOfWeek: [
          { day: 'Mon', score: 3.5 }, { day: 'Tue', score: 4.0 }, { day: 'Wed', score: 3.2 },
          { day: 'Thu', score: 4.5 }, { day: 'Fri', score: 4.8 }, { day: 'Sat', score: 4.2 }, { day: 'Sun', score: 3.8 }
      ],
      distribution: [
          { name: 'Happy', value: 45 }, { name: 'Neutral', value: 30 }, { name: 'Sad', value: 15 }, { name: 'Angry', value: 10 }
      ]
  };

  const analytics = useMemo(() => {
    if (!isLoaded) return null;
    const realData = aggregateMoodData(journals, emotionLogs);
    // If no real data, use mock so the charts are visible
    if (!realData.timeline.length && !realData.dayOfWeek.every(d => d.score === 0)) return realData;
    if (!realData.timeline.length) return MOCK_DATA;
    return realData;
  }, [isLoaded, journals, emotionLogs]);

  const stability = useMemo(() => {
    if (!analytics) return 0;
    return calculateStabilityScore(analytics.timeline);
  }, [analytics]);

  const averageMood = journals.length 
    ? Math.round(journals.reduce((acc, j) => acc + j.mood_score, 0) / journals.length) 
    : 0;

  const currentMoodRating = useMemo(() => {
      if (!analytics || analytics.timeline.length === 0) return 0;
      return analytics.timeline[analytics.timeline.length - 1].score;
  }, [analytics]);

  // Map label to localized keys
  const moodLabel = t(`emotions.${["neutral", "sad", "sad", "neutral", "happy", "happy"][currentMoodRating]}`);

  const improvementPercent = useMemo(() => {
    if (!analytics || analytics.timeline.length < 2) return 0;
    const last = analytics.timeline[analytics.timeline.length - 1].score;
    const prev = analytics.timeline[analytics.timeline.length - 2].score;
    if (!prev) return 0;
    return Math.round(((last - prev) / prev) * 100);
  }, [analytics]);

  return (
    <div className="max-w-[1920px] mx-auto p-4 md:p-14 space-y-10 md:space-y-14 relative z-10 min-h-[calc(100vh-80px)] pb-16 md:pb-20">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
            <div className="p-3 glass-panel rounded-2xl shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                <Activity className="w-6 h-6 md:w-8 md:h-8 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            </div>
            <div>
                <h1 className="text-2xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-white to-[#00f3ff]">
                    {t('dashboard.title')}
                </h1>
                <p className="text-xs md:text-base text-emerald-400 font-black uppercase tracking-widest mt-1">{t('dashboard.status')}</p>
            </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-6">
            <div className="flex flex-col items-end">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none mb-1">System Stability</span>
                <span className="text-lg font-black text-[#00f3ff] drop-shadow-[0_0_8px_rgba(0,243,255,0.4)]">{stability}%</span>
            </div>
            <div className="w-[100px] h-1 bg-gray-900 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stability}%` }}
                    className="h-full bg-[#00f3ff] shadow-[0_0_10px_#00f3ff]" 
                />
            </div>
        </div>
      </motion.div>

      {/* Daily Motivation Protocol */}
      <div className="mb-12">
          <DailyQuoteCard score={stability} />
      </div>

      {/* KPI Cards: Dynamic Mood Stats */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
      >
        <motion.div variants={cardVariants} className="glass-panel p-6 rounded-3xl border border-[#00f3ff]/20 shadow-[0_0_20px_rgba(0,243,255,0.05)] flex flex-col justify-between group relative overflow-hidden h-40">
           <div className="absolute inset-0 bg-gradient-to-br from-[#00f3ff]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
           <div className="relative z-10">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#00f3ff] flex items-center gap-2 mb-4">
                    <Activity size={14} /> {t('dashboard.avg_mood')}
                </h2>
                <div className="flex items-end gap-1 md:gap-2">
                    <span className="text-2xl md:text-4xl font-black text-white">{currentMoodRating}</span>
                    <span className="text-xs md:text-sm text-[#00f3ff] font-bold mb-1 uppercase italic tracking-tighter">/ 5</span>
                </div>
            </div>
            <p className="relative z-10 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{moodLabel}</p>
            {/* Aura Line */}
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-[#00f3ff] to-transparent group-hover:w-full transition-all duration-700 opacity-80"></div>
        </motion.div>

        <motion.div variants={cardVariants} className="glass-panel p-6 rounded-3xl border border-[#bc13fe]/20 shadow-[0_0_20px_rgba(188,19,254,0.05)] flex flex-col justify-between group h-40 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#bc13fe]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#bc13fe] flex items-center gap-2 mb-4">
                    <TrendingUp size={14} /> {t('dashboard.trend')}
                </h2>
                <div className="flex items-center gap-1 md:gap-2">
                    <span className={`text-2xl md:text-4xl font-black ${improvementPercent >= 0 ? 'text-green-400' : 'text-rose-500'}`}>
                        {improvementPercent >= 0 ? '+' : ''}{improvementPercent}%
                    </span>
                    <Zap size={16} className={improvementPercent >= 0 ? 'text-green-400' : 'text-rose-500'} />
                </div>
            </div>
            <p className="relative z-10 text-[10px] font-bold text-gray-400 uppercase tracking-widest">24H PERFORMANCE</p>
            {/* Aura Line */}
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-[#bc13fe] to-transparent group-hover:w-full transition-all duration-700 opacity-80"></div>
        </motion.div>

        <motion.div variants={cardVariants} className="glass-panel p-6 rounded-3xl border border-[#00ffcc]/20 shadow-[0_0_20px_rgba(0,255,204,0.05)] flex flex-col justify-between group h-40 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00ffcc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#00ffcc] flex items-center gap-2 mb-4">
                    <ShieldCheck size={14} /> {t('auth.face_login')}
                </h2>
                <div className="text-2xl md:text-4xl font-black text-white">{stability}</div>
            </div>
            <p className="relative z-10 text-[10px] font-bold text-gray-400 uppercase tracking-widest">MOOD BALANCE</p>
            {/* Aura Line */}
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-[#00ffcc] to-transparent group-hover:w-full transition-all duration-700 opacity-80"></div>
        </motion.div>

        <motion.div variants={cardVariants} className="glass-panel p-6 rounded-3xl border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] flex flex-col justify-between group h-40 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2 mb-4">
                    <Zap size={14} /> {t('dashboard.streak')}
                </h2>
                <div className="text-2xl md:text-4xl font-black text-white">{journals.length > 5 ? '7 DAYS' : '2 DAYS'}</div>
            </div>
            <p className="relative z-10 text-[10px] font-bold text-gray-400 uppercase tracking-widest">LOGGING COMMITMENT</p>
            {/* Aura Line */}
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-white to-transparent group-hover:w-full transition-all duration-700 opacity-50"></div>
        </motion.div>
      </motion.div>

      {/* Main Analytics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Graph 1: Timeline Area Chart */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 glass-panel p-6 md:p-8 rounded-3xl md:rounded-[40px] border border-white/10 shadow-xl overflow-hidden relative"
        >
            <div className="flex items-center justify-between mb-8 px-2">
                <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                    <TrendingUp size={16} className="text-[#00f3ff]" /> {t('dashboard.trend')}
                </h3>
            </div>
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics?.timeline || []}>
                        <defs>
                            <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#00f3ff" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 700 }} 
                            tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        />
                        <YAxis hide domain={[1, 5]} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#02000f', border: '1px solid rgba(0,243,255,0.3)', borderRadius: '16px', fontWeight: 'bold' }}
                            itemStyle={{ color: '#00f3ff' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="score" 
                            stroke="#00f3ff" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorMood)" 
                            animationDuration={2000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>

        {/* Graph 2: Distribution Pie */}
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-8 rounded-[40px] border border-white/10 shadow-xl flex flex-col"
        >
            <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2 mb-8 px-2">
                <PieChartIcon size={16} className="text-[#bc13fe]" /> Emotional Array
            </h3>
            <div className="h-64 w-full flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={analytics?.distribution || []}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                        >
                            {analytics?.distribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                             contentStyle={{ backgroundColor: '#02000f', border: '1px solid rgba(188,19,254,0.3)', borderRadius: '16px' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
                {analytics?.distribution.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                        <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }}></div>
                        <span className="truncate">{d.name}</span>
                    </div>
                ))}
            </div>
        </motion.div>

        {/* Graph 3: Day of Week Bar Chart */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 glass-panel p-6 md:p-8 rounded-3xl md:rounded-[40px] border border-white/10 shadow-xl overflow-hidden relative h-[400px] md:h-[450px]"
        >
             <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2 mb-12 px-2">
                <BarChartIcon size={16} className="text-[#00ffcc]" /> 7-Day Cycle Average
            </h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics?.dayOfWeek || []}>
                        <XAxis 
                            dataKey="day" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 700 }} 
                        />
                        <YAxis hide domain={[0, 5]} />
                        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#02000f', border: '1px solid rgba(0,255,204,0.3)', borderRadius: '16px' }} />
                        <Bar 
                            dataKey="score" 
                            radius={[12, 12, 0, 0]}
                            animationDuration={1500}
                        >
                             {analytics?.dayOfWeek.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.score >= 4 ? '#00ffcc' : entry.score >= 3 ? '#00f3ff' : '#ff0055'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <p className="mt-4 text-[10px] font-bold text-gray-500 text-center uppercase tracking-widest">Performance per circadian cycle</p>
        </motion.div>

        {/* AI Recommendations Module */}
        <div className="lg:col-span-3">
            <SuggestionsPanel score={averageMood} />
        </div>

      </div>

      {/* Reports Summary Section */}
      <div className="grid md:grid-cols-2 gap-8 mt-4">
          <motion.div variants={cardVariants} className="glass-panel p-10 rounded-[40px] border border-[#00f3ff]/20 flex flex-col justify-between group">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <CalendarDays className="text-[#00f3ff]" /> {t('dashboard.recommendations')}
              </h2>
              <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                      <span className="text-xs text-gray-400 font-bold uppercase">{t('dashboard.avg_mood')}</span>
                      <span className="text-lg font-black text-[#00f3ff]">{Math.round(averageMood)}%</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                      <span className="text-xs text-gray-400 font-bold uppercase">Dominant Emotion</span>
                      <span className="text-lg font-black text-white">{analytics?.distribution[0]?.name || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                      <span className="text-xs text-gray-400 font-bold uppercase">Stability Index</span>
                      <span className="text-lg font-black text-[#00ffcc]">{stability}/100</span>
                  </div>
              </div>
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-[#00f3ff] to-transparent group-hover:w-full transition-all duration-700 opacity-80"></div>
          </motion.div>

          <motion.div variants={cardVariants} className="glass-panel p-10 rounded-[40px] border border-[#bc13fe]/20 flex flex-col justify-between group">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <BrainCircuit className="text-[#bc13fe]" /> My Growth Journal
              </h2>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 italic text-sm text-gray-300 font-medium leading-relaxed">
                  "Current metrics indicate a {stability > 70 ? 'high' : 'variable'} emotional stability with a {improvementPercent >= 0 ? 'positive' : 'diverging'} trajectory. Recommend maintaining protocol consistency."
              </div>
              <div className="mt-6 flex gap-4">
                  <div className="px-4 py-2 bg-[#bc13fe]/10 border border-[#bc13fe]/30 rounded-full text-[10px] font-black tracking-widest text-[#bc13fe] uppercase">AI Verified</div>
                  <div className="px-4 py-2 bg-[#00f3ff]/10 border border-[#00f3ff]/30 rounded-full text-[10px] font-black tracking-widest text-[#00f3ff] uppercase">Optimized</div>
              </div>
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-[#bc13fe] to-transparent group-hover:w-full transition-all duration-700 opacity-80"></div>
          </motion.div>
      </div>

    </div>
  );
}
