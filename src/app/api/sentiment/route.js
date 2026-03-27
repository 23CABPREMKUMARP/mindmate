import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req) {
  try {
    const { text } = await req.json();

    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      systemInstruction: "You are a sentiment analysis engine. Analyze the sentiment of the provided text and strictly return exactly one of these labels: 'Positive', 'Negative', 'Neutral', 'Stress'."
    });

    const result = await model.generateContent(text);
    const label = result.response.text().trim();

    return NextResponse.json({ 
        sentiment: [
            { label: label, score: 0.99 }
        ] 
    });
  } catch (error) {
    console.error("Redirected Sentiment API Error:", error);
    return NextResponse.json({ error: "Failed to fetch Gemini sentiment" }, { status: 500 });
  }
}
