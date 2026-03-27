import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req) {
  try {
    const { messages } = await req.json();
    const message = messages[messages.length - 1].content;
    const history = messages.slice(0, -1);

    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      systemInstruction: "You are a highly empathetic AI mental health support assistant. Focus on supportive listening."
    });

    const prompt = `History: ${JSON.stringify(history)}\n\nUser: ${message}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error("Redirected Chat API Error:", error);
    return NextResponse.json({ error: "Failed to fetch Gemini response" }, { status: 500 });
  }
}
