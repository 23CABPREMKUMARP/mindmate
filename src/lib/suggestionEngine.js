export const MOOD_SUGGESTIONS = {
  happy: [
    {
      id: "h1",
      icon: "✍️",
      title: "Gratitude Journal",
      desc: "Document three specific moments that amplified your neural satisfaction today.",
      action: "Journal",
      link: "/journal",
      color: "#4ade80"
    },
    {
      id: "h2",
      icon: "🎵",
      title: "Upbeat Frequency",
      desc: "Synchronize your mood with high-tempo neural audio pulses.",
      action: "Listen",
      link: "https://open.spotify.com/playlist/37i9dQZF1DXdPec7WLTqDb",
      isExternal: true,
      color: "#00f3ff"
    },
    {
      id: "h3",
      icon: "🏃",
      title: "Kinetic Burst",
      desc: "Convert positive energy into physical movement with a 15-min walk.",
      action: "Exercise",
      link: "/mood-booster",
      color: "#fbbf24"
    }
  ],
  sad: [
    {
      id: "s1",
      icon: "🧘",
      title: "Calm Protocol",
      desc: "Initialize a 4-7-8 breathing sequence to stabilize emotional vectors.",
      action: "Breathe",
      link: "/mood-booster",
      color: "#60a5fa"
    },
    {
      id: "s2",
      icon: "📝",
      title: "Thought Dumping",
      desc: "Offload negative neural data into the encrypted ledger.",
      action: "Ledger",
      link: "/journal",
      color: "#bc13fe"
    },
    {
      id: "s3",
      icon: "📞",
      title: "Uplink Request",
      desc: "Connect with a trusted biological contact for perspective sharing.",
      action: "Talk",
      link: null,
      color: "#f87171"
    }
  ],
  angry: [
    {
      id: "a1",
      icon: "💨",
      title: "Cortisol Flush",
      desc: "Engage in rapid motor skills to dissipate aggressive neural buildup.",
      action: "Play",
      link: "/mood-booster",
      color: "#ef4444"
    },
    {
      id: "a2",
      icon: "🚶",
      title: "Isolation Protocol",
      desc: "Remove yourself from current environmental triggers for 10 minutes.",
      action: "Take Break",
      link: null,
      color: "#f97316"
    },
    {
      id: "a3",
      icon: "💧",
      title: "System Cooling",
      desc: "Hydrate biological systems to regulate internal temperature spikes.",
      action: "Drink Water",
      link: null,
      color: "#00f3ff"
    }
  ],
  stressed: [
    {
      id: "st1",
      icon: "🌬️",
      title: "Oxygen Intake",
      desc: "Execute the 4-7-8 breathing override to lower heart-rate telemetry.",
      action: "Stabilize",
      link: "/mood-booster",
      color: "#00f3ff"
    },
    {
      id: "st2",
      icon: "📵",
      title: "Signal Block",
      desc: "Terminate screen time for 20 minutes to reduce sensory overload.",
      action: "Offline",
      link: null,
      color: "#94a3b8"
    },
    {
      id: "st3",
      icon: "📋",
      title: "Task Sharding",
      desc: "Deconstruct your main objective into three micro-operations.",
      action: "De-fragment",
      link: null,
      color: "#818cf8"
    }
  ],
  neutral: [
    {
      id: "n1",
      icon: "🧠",
      title: "Knowledge Acquisition",
      desc: "Initialize a new learning process to stimulate neural growth.",
      action: "Learn",
      link: "https://www.ted.com/talks",
      isExternal: true,
      color: "#00f3ff"
    },
    {
      id: "n2",
      icon: "📅",
      title: "Chronology Optimization",
      desc: "Map out your next 24-hour cycle to ensure algorithmic efficiency and time-sync.",
      action: "Review",
      link: "/dashboard",
      color: "#bc13fe"
    },
    {
      id: "n3",
      icon: "⚙️",
      title: "Manual Op Recalibration",
      desc: "Engage in focal mini-tasks to transition biological sensors into a high-energy state.",
      action: "Calibrate",
      link: "/mood-booster",
      color: "#4ade80"
    }
  ]
};

export const MOOD_QUOTES = {
  happy: [
    { quote: "Keep smiling, life looks good on you.", author: "Aura System" },
    { quote: "Happiness is contagious. Spread the frequency.", author: "Neural Core" },
    { quote: "Enjoy the little things today.", author: "Bio-Feedback" },
    { quote: "Stay positive and keep going.", author: "Dopamine Monitor" }
  ],
  sad: [
    { quote: "Tough times never last, but tough people do.", author: "Resilience Protocol" },
    { quote: "Every day is a new beginning.", author: "System Reset" },
    { quote: "You are stronger than you think.", author: "Core Logic" },
    { quote: "This moment will pass.", author: "Temporal Scan" },
    { quote: "Your feelings are valid.", author: "Empathy Agent" }
  ],
  angry: [
    { quote: "Speak when you are calm. React when you are ready.", author: "Cooling Unit" },
    { quote: "Anger is one letter short of danger.", author: "Safety Guard" },
    { quote: "Breathe before you react.", author: "Inhale Module" }
  ],
  stressed: [
    { quote: "Slow down. Everything will be okay.", author: "Efficiency Buffer" },
    { quote: "One step at a time.", author: "Process Manager" },
    { quote: "You are doing your best.", author: "Performance Log" }
  ],
  neutral: [
    { quote: "Make today meaningful.", author: "Purpose Engine" },
    { quote: "Small progress is still progress.", author: "Increment Tracker" },
    { quote: "Try something new today.", author: "Discovery Protocol" }
  ]
};

export const getMoodCategory = (moodScoreOrType) => {
  if (typeof moodScoreOrType === 'number') {
    if (moodScoreOrType >= 80) return 'happy';
    if (moodScoreOrType >= 60) return 'neutral';
    if (moodScoreOrType >= 40) return 'stressed';
    if (moodScoreOrType >= 20) return 'sad';
    return 'angry';
  }
  
  const type = String(moodScoreOrType).toLowerCase();
  if (MOOD_SUGGESTIONS[type]) return type;
  
  // Default mappings for face-api types
  if (['happy', 'surprised'].includes(type)) return 'happy';
  if (['sad', 'fearful'].includes(type)) return 'sad';
  if (['angry', 'disgusted'].includes(type)) return 'angry';
  if (['neutral'].includes(type)) return 'neutral';
  
  return 'neutral';
};
