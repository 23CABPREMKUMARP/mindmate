/**
 * Mood Score Mapping:
 * 1: Very Sad
 * 2: Sad
 * 3: Neutral
 * 4: Happy
 * 5: Very Happy
 */

const MOOD_MAP = {
  'angry': 1,
  'disgusted': 1,
  'fearful': 2,
  'sad': 2,
  'neutral': 3,
  'surprised': 4,
  'happy': 5
};

export const calculateMoodScore = ({ emotion, chatSentiment, voiceEmotion, journalScore }) => {
  let scores = [];
  
  if (emotion && MOOD_MAP[emotion.toLowerCase()]) {
    scores.push(MOOD_MAP[emotion.toLowerCase()]);
  }
  
  if (chatSentiment) {
    if (chatSentiment === 'Positive') scores.push(5);
    else if (chatSentiment === 'Negative') scores.push(1);
    else scores.push(3);
  }
  
  if (voiceEmotion && MOOD_MAP[voiceEmotion.toLowerCase()]) {
    scores.push(MOOD_MAP[voiceEmotion.toLowerCase()]);
  }
  
  if (journalScore !== undefined) {
    // Map 0-100 to 1-5
    scores.push(Math.ceil(journalScore / 20));
  }
  
  if (scores.length === 0) return 3; // default neutral
  
  const sum = scores.reduce((a, b) => a + b, 0);
  return Math.round(sum / scores.length);
};

export const aggregateMoodData = (journals, emotionLogs) => {
  // Combine data by date
  const timeline = {};
  const dayOfWeek = {
    Mon: { sum: 0, count: 0 },
    Tue: { sum: 0, count: 0 },
    Wed: { sum: 0, count: 0 },
    Thu: { sum: 0, count: 0 },
    Fri: { sum: 0, count: 0 },
    Sat: { sum: 0, count: 0 },
    Sun: { sum: 0, count: 0 }
  };
  
  const distribution = {
    Happy: 0,
    Sad: 0,
    Angry: 0,
    Stressed: 0,
    Neutral: 0,
    Surprised: 0
  };

  // Process Journals
  journals.forEach(j => {
    const date = new Date(j.created_at);
    const dateKey = date.toISOString().split('T')[0];
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const score = Math.ceil(j.mood_score / 20); // 1-5

    if (!timeline[dateKey]) timeline[dateKey] = { scores: [] };
    timeline[dateKey].scores.push(score);

    if (dayOfWeek[dayName]) {
      dayOfWeek[dayName].sum += score;
      dayOfWeek[dayName].count++;
    }

    // Rough distribution mapping
    if (score >= 4) distribution.Happy++;
    else if (score <= 2) distribution.Sad++;
    else distribution.Neutral++;
  });

  // Process Emotion Logs
  emotionLogs.forEach(e => {
    const date = new Date(e.created_at);
    const dateKey = date.toISOString().split('T')[0];
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const score = MOOD_MAP[e.mood.toLowerCase()] || 3;

    if (!timeline[dateKey]) timeline[dateKey] = { scores: [] };
    timeline[dateKey].scores.push(score);

    if (dayOfWeek[dayName]) {
      dayOfWeek[dayName].sum += score;
      dayOfWeek[dayName].count++;
    }

    const emotionName = e.mood.charAt(0).toUpperCase() + e.mood.slice(1).toLowerCase();
    if (distribution[emotionName] !== undefined) {
      distribution[emotionName]++;
    }
  });

  // Format Timeline
  const formattedTimeline = Object.keys(timeline).sort().map(date => ({
    date,
    score: Math.round(timeline[date].scores.reduce((a,b) => a+b, 0) / timeline[date].scores.length)
  }));

  // Format Day of Week
  const formattedDayOfWeek = Object.keys(dayOfWeek).map(day => ({
    day,
    score: dayOfWeek[day].count ? parseFloat((dayOfWeek[day].sum / dayOfWeek[day].count).toFixed(1)) : 0
  }));

  // Format Distribution
  const formattedDistribution = Object.keys(distribution).map(name => ({
    name,
    value: distribution[name]
  })).filter(d => d.value > 0);

  return {
    timeline: formattedTimeline,
    dayOfWeek: formattedDayOfWeek,
    distribution: formattedDistribution
  };
};

export const calculateStabilityScore = (timeline) => {
  if (timeline.length < 2) return 100;
  // Variance check
  const scores = timeline.map(t => t.score);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / scores.length;
  // stability is inversely proportional to variance
  return Math.max(0, Math.min(100, Math.round(100 - (variance * 20))));
};
