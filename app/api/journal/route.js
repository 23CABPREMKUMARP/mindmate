import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req) {
  try {
    const { data: entries, error } = await supabase.from('journals').select('*').order('created_at', { ascending: false });
    
    // Fallback static data if Supabase isn't configured
    if (error && error.message.includes('FetchError')) {
      return NextResponse.json([{ text: 'This is a mocked journal entry to help you prototype.', mood_score: 8, created_at: new Date().toISOString() }]);
    }

    if (error) throw error;
    
    return NextResponse.json(entries || []);
  } catch (err) {
    console.error("Journal GET error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { text, mood_score, title } = await req.json();

    const { data, error } = await supabase.from('journals').insert([
      { title, text, mood_score, created_at: new Date().toISOString() }
    ]);

    // Fallback static insert logic
    if (error && error.message.includes('FetchError')) {
      return NextResponse.json({ success: true, dummy: true });
    }

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Journal POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
