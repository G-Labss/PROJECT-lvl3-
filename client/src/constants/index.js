export const GOLD = '#c9a84c';

export const ZELLE_NUMBER = '+1 (616) 500-6583';

export const LESSON_LEVELS = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Maps our display day index (Mon=0) to JS Date.getDay() (Sun=0, Mon=1)
export const DISPLAY_TO_JS_DOW = [1, 2, 3, 4, 5, 6, 0];

export const HOURS = Array.from({ length: 13 }, (_, i) => {
  const h = i + 8; // 8am to 8pm
  return `${h.toString().padStart(2, '0')}:00`;
});

export const TIME_BLOCKS = [
  { key: '07:00', label: 'Morning', sub: '7AM – Noon' },
  { key: '12:00', label: 'Afternoon', sub: 'Noon – 5PM' },
  { key: '17:00', label: 'Evening', sub: '5PM – 9PM' },
];

export const NTRP_LEVELS = [
  { range: '1.0 – 2.5', label: 'Beginner', desc: 'Learning basic strokes and court positioning' },
  { range: '3.0 – 4.0', label: 'Intermediate', desc: 'Consistent strokes and tactical awareness' },
  { range: '4.5 – 5.5', label: 'Advanced', desc: 'Strong competitive play with refined technique' },
  { range: '6.0 – 7.0', label: 'Professional', desc: 'National and international tournament level' },
];
