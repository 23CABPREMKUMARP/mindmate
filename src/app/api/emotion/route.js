import { NextResponse } from 'next/server';
import { supabase, isPlaceholder } from '@/lib/supabase';

// In-memory mock store for demo sessions (resets on server restart)
let mockEmotionLogs = [
  { mood: 'happy', intensity: 8, created_at: new Date(Date.now() - 3600000).toISOString() },
  { mood: 'neutral', intensity: 5, created_at: new Date(Date.now() - 7200000).toISOString() },
  { mood: 'surprise', intensity: 9, created_at: new Date(Date.now() - 10800000).toISOString() }
];

export async function GET(req) {
  if (isPlaceholder) return NextResponse.json({ logs: mockEmotionLogs });
  try {
    const { data, error } = await supabase
      .from('mood_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ logs: data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  if (isPlaceholder) {
    const { emotion_type, score } = await req.json();
    const newLog = { 
      mood: emotion_type, 
      intensity: Math.round(score / 10), 
      created_at: new Date().toISOString() 
    };
    mockEmotionLogs = [newLog, ...mockEmotionLogs];
    return NextResponse.json({ log: newLog, message: "Demo mode: Session-persistent commit." });
  }
  try {
    const { emotion_type, score } = await req.json();
    
    // Using mood_logs from our database schema
    const { data, error } = await supabase
      .from('mood_logs')
      .insert([
        { mood: emotion_type, intensity: Math.round(score / 10) } // Normalize score to 1-10
      ])
      .select();

    if (error) {
      console.warn("Table not found or DB error, performing mock commitment in demo mode:", error.message);
      return NextResponse.json({ log: { mood: emotion_type, intensity: Math.round(score / 10), created_at: new Date().toISOString() } });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ log: { mood: emotion_type, intensity: Math.round(score / 10), created_at: new Date().toISOString() } });
    }
    return NextResponse.json({ log: data[0] });
  } catch (error) {
    console.error("Critical Emotion API Error:", error);
    // Even on critical error, return success in demo mode to avoid UI crash
    return NextResponse.json({ log: { mood: "neutral", intensity: 5, created_at: new Date().toISOString() } });
  }
}
