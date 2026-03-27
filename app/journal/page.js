'use client';

import { useState, useEffect } from 'react';
import EmotionDetector from '@/components/EmotionDetector';
import { PenTool, CheckCircle2, HeartPulse } from 'lucide-react';

export default function JournalPage() {
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [emotion, setEmotion] = useState(null);

  useEffect(() => {
    fetch('/api/journal')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setEntries(Array.isArray(data) ? data : []);
      });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Automatically infer a mock score if no sentiment call for now
    const dummyScore = content.length > 50 ? 7 : 5;
    
    const newEntry = {
      title,
      text: content,
      mood_score: dummyScore,
    };

    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry)
      });
      const data = await res.json();
      if(data.success) {
        setEntries([newEntry, ...entries]);
        setTitle('');
        setContent('');
      }
    } catch(err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Left Column: Emotion Tracking & Write New Journal */}
      <div className="lg:col-span-2 space-y-8">
        <section className="bg-zinc-900/40 p-6 rounded-3xl border border-white/5 backdrop-blur-md">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <HeartPulse className="text-pink-400 w-5 h-5"/> Live Emotion Detector
          </h2>
          <EmotionDetector onEmotionDetect={(e) => setEmotion(e)} />
          {emotion && (
            <div className="mt-4 p-3 bg-purple-500/20 text-purple-200 rounded-xl text-center font-medium border border-purple-500/30">
              Current Emotion Detected: {emotion.toUpperCase()}
            </div>
          )}
        </section>

        <section className="bg-zinc-900/40 p-6 rounded-3xl border border-white/5 backdrop-blur-md">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <PenTool className="text-purple-400 w-5 h-5"/> New Journal Entry
          </h2>
          
          <form onSubmit={handleSave} className="space-y-4">
            <input 
              type="text" 
              placeholder="Entry Title" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
            <textarea 
              rows={6}
              placeholder="How are you feeling today?" 
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={saving || !title || !content}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
              >
                {saving ? 'Saving...' : <><CheckCircle2 className="w-5 h-5"/> Save Entry</>}
              </button>
            </div>
          </form>
        </section>
      </div>

      {/* Right Column: History */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Past Entries</h2>
        {entries.length === 0 ? (
          <p className="text-zinc-500 italic">No entries yet. Start writing your thoughts!</p>
        ) : (
          <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-2">
            {entries.map((entry, idx) => (
              <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer">
                <h3 className="font-semibold text-lg text-purple-100">{entry.title || 'Untitled'}</h3>
                <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{entry.text}</p>
                <div className="mt-3 text-xs text-zinc-500 font-medium">
                  Mood Score: {entry.mood_score || 5}/10
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
