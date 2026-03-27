import { NextResponse } from 'next/server';
import { supabase, isPlaceholder } from '@/lib/supabase';

export async function POST(req) {
  if (isPlaceholder) return NextResponse.json({ success: true, user: { name: 'Demo User' }, demo: true });
  try {
    const { name, descriptor } = await req.json();

    if (!name || !descriptor) {
       return NextResponse.json({ error: "Missing name or descriptor" }, { status: 400 });
    }

    // Save descriptor (128d Float32Array) as JSON representation
    const { data, error } = await supabase
      .from('face_embeddings')
      .insert([
        { name, embedding: JSON.stringify(Array.from(Object.values(descriptor))) }
      ])
      .select();

    if (error) throw error;
    
    return NextResponse.json({ success: true, user: data[0] });
  } catch (error) {
    return NextResponse.json({ error: "Failed to register face" }, { status: 500 });
  }
}
