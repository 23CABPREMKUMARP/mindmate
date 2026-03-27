import { NextResponse } from 'next/server';
import { supabase, isPlaceholder } from '@/lib/supabase';

// In-memory mock store for demo sessions (resets on server restart)
let mockJournals = [
  { id: 1, title: "Initial Synchronization", content: "Neural pathways established. System baseline stable.", mood_score: 4, created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 2, title: "Cognitive Surplus", content: "Elevated dopamine response detected. Optimizing productivity windows.", mood_score: 5, created_at: new Date(Date.now() - 43200000).toISOString() }
];

export async function GET(req) {
  if (isPlaceholder) return NextResponse.json({ journals: mockJournals });
  try {
    const { data, error } = await supabase
      .from('journals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ journals: data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  if (isPlaceholder) {
    const { content, mood_score, title } = await req.json();
    const newJournal = {
      id: Date.now(),
      title,
      content,
      mood_score,
      created_at: new Date().toISOString()
    };
    mockJournals = [newJournal, ...mockJournals];
    return NextResponse.json({ journal: newJournal, message: "Demo mode: Session-persistent save." });
  }
  try {
    const { content, mood_score, title } = await req.json();
    const { data, error } = await supabase
      .from('journals')
      .insert([
        { content, mood_score, title }
      ])
      .select();

    if (error) throw error;
    return NextResponse.json({ journal: data[0] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
