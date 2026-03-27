import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { text } = await req.json();

    const hfKey = process.env.HUGGINGFACE_API_KEY;

    if (!hfKey) {
      // Mocked up response for development without API key
      const isPositive = text.length > 30 || text.includes('happy');
      return NextResponse.json({
        sentiment: isPositive ? 'POSITIVE' : 'NEGATIVE',
        score: isPositive ? 0.8 : 0.6,
      });
    }

    // Call HuggingFace distilbert base uncased finetuned for sentiment
    const response = await fetch("https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english", {
      headers: { 
        "Authorization": `Bearer ${hfKey}`,
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ inputs: text }),
    });

    const result = await response.json();
    const sortedScores = result[0]?.sort((a, b) => b.score - a.score);
    
    return NextResponse.json({ 
      sentiment: sortedScores?.[0]?.label || 'NEUTRAL',
      score: sortedScores?.[0]?.score || 0.5 
    });

  } catch (error) {
    console.error("Sentiment API Error:", error);
    return NextResponse.json({ error: "Failed to analyze sentiment." }, { status: 500 });
  }
}
