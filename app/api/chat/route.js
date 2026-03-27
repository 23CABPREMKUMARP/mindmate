import { NextResponse } from 'next/server';

const CRISIS_KEYWORDS = ['die', 'suicide', 'kill', 'end it all', 'hopeless', 'hurt myself'];

export async function POST(req) {
  try {
    const { message, history } = await req.json();

    // 1. Crisis Detection
    const lowerMessage = message.toLowerCase();
    const isCrisis = CRISIS_KEYWORDS.some(kw => lowerMessage.includes(kw));

    if (isCrisis) {
      return NextResponse.json({
        reply: "I am really sorry that you're feeling this way, but please know you don't have to go through this alone. I strongly encourage you to reach out to a professional or someone you trust. \n\nIf you're in immediate danger, please call 911 or your local emergency number. You can also dial 988 in the US or text HOME to 741741 for the Crisis Text Line.",
        crisisDetected: true
      });
    }

    // 2. Free LLM Inference (HuggingFace Phi-3 or similar free tier via API)
    // We try catching the API key, otherwise fallback to canned empathetic responses for testing
    const hfKey = process.env.HUGGINGFACE_API_KEY;

    if (!hfKey) {
      // Dummy response for hackathon demo if no API key is set
      const demoResponses = [
        "I hear you. That sounds really challenging. How long have you been feeling this way?",
        "It takes courage to share that. Remember to be gentle with yourself today.",
        "That's completely understandable. Would it help to try a quick grounding exercise together?",
        "I'm here for you. From a CBT perspective, sometimes our thoughts can twist the reality. What's the evidence for and against what you're feeling right now?",
      ];
      const fallbackReply = demoResponses[Math.floor(Math.random() * demoResponses.length)];
      
      // Artificial delay to simulate AI typing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return NextResponse.json({
        reply: fallbackReply,
        crisisDetected: false
      });
    }

    // Actual HF call
    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", {
      headers: {
        "Authorization": `Bearer ${hfKey}`,
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        inputs: `[INST] You are an empathetic AI mental health assistant. Respond kindly and offer brief CBT or DBT guidance without giving medical advice. The user says: ${message} [/INST]`,
      }),
    });

    const result = await response.json();
    let reply = result[0]?.generated_text?.split("[/INST]")[1]?.trim() || "I am here for you. Could you tell me more about that?";

    return NextResponse.json({ reply, crisisDetected: false });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ reply: "I'm having a little trouble connecting to my thought engine right now. Let's take a deep breath together.", error: error.message }, { status: 500 });
  }
}
