'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Calendar, Activity, BookOpen, Wind } from 'lucide-react';
import '../../src/lib/i18n';

const mockChartData = [
  { name: 'Mon', score: 4 },
  { name: 'Tue', score: 6 },
  { name: 'Wed', score: 5 },
  { name: 'Thu', score: 8 },
  { name: 'Fri', score: 7 },
  { name: 'Sat', score: 9 },
  { name: 'Sun', score: 8 },
];

export default function Dashboard() {
  const { t } = useTranslation();
  const [entries, setEntries] = useState([]);
  
  useEffect(() => {
    fetch('/api/journal')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setEntries(Array.isArray(data) ? data : []);
      });
  }, []);

  return (
    <div className="max-w-[1800px] mx-auto py-12 px-8 space-y-12">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#bc13fe] via-white to-[#00f3ff] tracking-tighter uppercase italic">
            {t('dashboard.title')}
          </h1>
          <p className="text-[#00f3ff] mt-2 font-black uppercase tracking-widest text-xs">{t('dashboard.subtitle')}</p>
        </div>
      </div>

      {/* High-level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard icon={<Calendar />} label={t('dashboard.stat_streak')} value="5 Days" color="from-[#bc13fe] to-purple-600" />
        <StatCard icon={<Activity />} label={t('dashboard.stat_mood')} value="6.7/10" color="from-[#00f3ff] to-blue-600" />
        <StatCard icon={<BookOpen />} label={t('dashboard.stat_journals')} value={entries.length || 12} color="from-green-500 to-emerald-600" />
        <StatCard icon={<Wind />} label={t('dashboard.stat_checkins')} value="24" color="from-orange-500 to-red-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Weekly Chart */}
        <div className="lg:col-span-2 glass-panel p-10 rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden group">
          <h2 className="text-2xl font-black mb-10 flex items-center gap-4 text-white uppercase tracking-tight">
            <Activity className="text-[#00f3ff]" />
            {t('dashboard.chart_title')}
          </h2>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontWeight: 'bold'}} />
                <YAxis dataKey="score" stroke="rgba(255,255,255,0.3)" domain={[0, 10]} tick={{fill: 'rgba(255,255,255,0.5)', fontWeight: 'bold'}}/>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(5, 0, 20, 0.9)', border: '1px solid rgba(0, 243, 255, 0.4)', borderRadius: '24px', backdropBlur: '12px' }}
                  itemStyle={{ color: '#00f3ff', fontWeight: '900' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="url(#colorUv)" 
                  strokeWidth={6} 
                  dot={{ r: 6, fill: '#00f3ff', strokeWidth: 0 }} 
                  activeDot={{ r: 12, fill: '#bc13fe', stroke: '#fff', strokeWidth: 4 }} 
                />
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#00f3ff" />
                    <stop offset="100%" stopColor="#bc13fe" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Recommendations Engine */}
        <div className="glass-panel p-10 rounded-[40px] border border-white/10 shadow-2xl flex flex-col">
          <h2 className="text-2xl font-black mb-10 text-white uppercase tracking-tight">{t('dashboard.rec_title')}</h2>
          <div className="flex-1 space-y-6">
            <RecommendationItem 
              title={t('dashboard.rec_breathing')} 
              desc={t('dashboard.rec_breathing_desc')}
              tag="Breathing"
            />
            <RecommendationItem 
              title={t('dashboard.rec_gratitude')} 
              desc={t('dashboard.rec_gratitude_desc')}
              tag="Journaling"
            />
            <RecommendationItem 
              title={t('dashboard.rec_sleep')} 
              desc={t('dashboard.rec_sleep_desc')}
              tag="Routine"
            />
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className={`p-8 rounded-[35px] bg-gradient-to-br ${color} relative overflow-hidden group shadow-xl transition-all hover:scale-[1.02]`}>
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all z-0"></div>
      <div className="relative z-10 flex flex-col gap-6">
        <div className="p-4 bg-white/20 rounded-2xl inline-flex self-start backdrop-blur-md shadow-lg text-white">
          {icon}
        </div>
        <div>
          <p className="text-white/70 font-black uppercase tracking-widest text-xs">{label}</p>
          <p className="text-4xl font-black text-white tracking-tighter mt-2">{value}</p>
        </div>
      </div>
    </div>
  );
}

function RecommendationItem({ title, desc, tag }) {
  return (
    <div className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-[#00f3ff]/30 transition-all cursor-pointer group hover:bg-[#00f3ff]/5">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-black text-lg text-white group-hover:text-[#00f3ff] transition-colors">{title}</h3>
        <span className="text-[10px] font-black tracking-widest uppercase px-3 py-1 bg-white/10 rounded-full text-white/40 group-hover:bg-[#00f3ff]/20 group-hover:text-[#00f3ff] transition-all">
          {tag}
        </span>
      </div>
      <p className="text-xs font-bold text-white/50 leading-relaxed uppercase tracking-tighter">{desc}</p>
    </div>
  );
}
