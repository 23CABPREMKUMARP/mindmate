import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { mood_score } = await req.json();
    
    let recommendations = [];
    
    if (mood_score < 40) {
      recommendations = [
        "Reach out to our Crisis Helpline if you're feeling overwhelmed.",
        "Try the 'Breathing Bubble' in our Mood Booster section.",
        "Talk to the AI Therapy Chat for a safe space to vent."
      ];
    } else if (mood_score < 70) {
      recommendations = [
        "Play the 'Gratitude Game' to lift your spirits.",
        "Take a 15-minute walk outside.",
        "Write down your feelings in the Journal."
      ];
    } else {
      recommendations = [
        "Keep up the great mood! Consider a quick workout.",
        "Learn a new skill or read a book.",
        "Help someone else and spread the positivity."
      ];
    }

    return NextResponse.json({ recommendations });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 });
  }
}
