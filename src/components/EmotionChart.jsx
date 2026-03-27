"use client";
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = {
  happy: '#4ade80',  // green-400
  sad: '#60a5fa',    // blue-400
  angry: '#f87171',  // red-400
  fear: '#c084fc',   // purple-400
  surprise: '#facc15', // yellow-400
  neutral: '#9ca3af', // gray-400
  disgust: '#a3e635'  // lime-400
};

export default function EmotionChart({ logs }) {
  if (!logs || logs.length === 0) return <p className="text-gray-500">No emotion logs yet.</p>;

  // Count emotions for Pie Chart
  const emotionCounts = logs.reduce((acc, log) => {
    acc[log.mood] = (acc[log.mood] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(emotionCounts).map(mood => ({
    name: mood,
    value: emotionCounts[mood]
  })).sort((a,b) => b.value - a.value); // Sort to get most frequent

  // Timeline for Bar Chart
  const timelineData = logs.slice().reverse().map((log, index) => ({
    time: new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    mood: log.mood,
    intensity: log.intensity
  }));

  const mostFrequent = pieData.length > 0 ? pieData[0].name : "Unknown";

  return (
    <div className="grid md:grid-cols-2 gap-8 w-full mt-4">
      <div className="bg-white/5 border border-white/10 p-6 rounded-3xl shadow-inner relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00f3ff]/5 to-transparent pointer-events-none"></div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">Emotion Breakdown</h3>
        <div className="h-64 md:h-80 relative z-10 min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="rgba(255,255,255,0.1)"
              >
                {pieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[entry.name] || COLORS.neutral} 
                    style={{ filter: `drop-shadow(0 0 8px ${COLORS[entry.name] || COLORS.neutral})` }}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 0 20px rgba(0,243,255,0.2)' }}
                itemStyle={{ textTransform: 'capitalize', fontWeight: 'bold', color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mt-4">
          Dominant State: <span className="text-[#00f3ff] drop-shadow-[0_0_8px_rgba(0,243,255,0.8)] ml-2 text-sm">{mostFrequent}</span>
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 p-6 rounded-3xl shadow-inner relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#bc13fe]/5 to-transparent pointer-events-none"></div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">Recent Biometric Intensity</h3>
        <div className="h-64 md:h-80 relative z-10 min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 10}} />
              <YAxis hide domain={[0, 10]} />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 0 20px rgba(188,19,254,0.2)' }}
                itemStyle={{ color: '#fff', textTransform: 'capitalize', fontWeight: 'bold' }}
              />
              <Bar dataKey="intensity" radius={[4, 4, 4, 4]}>
                {timelineData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[entry.mood] || COLORS.neutral} 
                    style={{ filter: `drop-shadow(0 0 5px ${COLORS[entry.mood] || COLORS.neutral})` }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
