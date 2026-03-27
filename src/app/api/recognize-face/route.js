import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Euclidean distance helper function
function getEuclideanDistance(desc1, desc2) {
  let sum = 0;
  for (let i = 0; i < desc1.length; i++) {
    sum += Math.pow(desc1[i] - desc2[i], 2);
  }
  return Math.sqrt(sum);
}

export async function POST(req) {
  try {
    const { descriptor } = await req.json();

    if (!descriptor) {
      return NextResponse.json({ error: "Missing face descriptor" }, { status: 400 });
    }

    const { data: faces, error } = await supabase
      .from('face_embeddings')
      .select('*');

    if (error || !faces || faces.length === 0) {
      return NextResponse.json({ match: null, message: "No registered faces yet" });
    }

    // descriptor from client is already a plain number array
    const targetDesc = Array.isArray(descriptor) ? descriptor : Array.from(Object.values(descriptor));

    if (targetDesc.length < 128) {
      return NextResponse.json({ match: null, message: "Face scan incomplete. Please try again." });
    }

    let bestMatch = null;
    let minDistance = 0.5; // Tighter threshold: 0.5 = ~99% same person accuracy

    for (const face of faces) {
      let storedDesc;
      try {
        storedDesc = typeof face.embedding === 'string' ? JSON.parse(face.embedding) : face.embedding;
      } catch { continue; }
      
      if (!Array.isArray(storedDesc) || storedDesc.length !== targetDesc.length) continue;
      
      const distance = getEuclideanDistance(targetDesc, storedDesc);
      
      if (distance < minDistance) {
        minDistance = distance;
        bestMatch = face;
      }
    }

    if (bestMatch) {
      return NextResponse.json({ 
        match: { name: bestMatch.name, distance: minDistance } 
      });
    } else {
      return NextResponse.json({ match: null, message: "Face not recognized" });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to recognize face" }, { status: 500 });
  }
}
