import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const systemInstruction = `You are a highly empathetic AI mental health support assistant. 
Analyze the user's text and detect emotion, sentiment, stress level, and mental state.
If the user sounds sad, stressed, anxious, or depressed, respond with highly supportive and calming messages.
If the message contains crisis or self-harm intent, provide a supportive response and encourage contacting trusted people or a hotline (e.g. 988). Do NOT act as a medical professional.

You MUST return your ENTIRE response as a valid JSON object matching this exact schema:
{
  "response": "Your empathetic conversational reply to the user here.",
  "emotion": "Happy|Sad|Angry|Neutral|Stress|Fear|Disgust",
  "sentiment": "Positive|Negative|Neutral",
  "confidence": "Percentage 0-100",
  "stress_level": "Low|Medium|High|Severe",
  "suggestion": "A helpful habit, game, or breathing exercise recommendation.",
  "crisis_flag": boolean
}`;

export async function POST(req) {
  try {
    const { message, history } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      systemInstruction: systemInstruction,
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `Conversation history: ${JSON.stringify(history)}\n\nUser's new message: "${message}"\n\nPlease output ONLY valid JSON matching the exact schema provided in the system instructions.`;

    const result = await model.generateContent(prompt);
    const textData = result.response.text();
    const parsed = JSON.parse(textData);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Gemini API Error Detail:", error.message);
    if (error.response) {
      console.error("Gemini Response Error:", await error.response.text());
    }
    return NextResponse.json({ error: "Failed to fetch Gemini response", detail: error.message }, { status: 500 });
  }
}
