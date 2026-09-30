export type MoodKey = "dawn" | "day" | "dusk" | "night";

export interface Mood {
  key: MoodKey;
  /** Micro-label shown in the hero, e.g. "dusk mode". */
  label: string;
  /** Multiplier for particle tint saturation toward the mood accent. */
  warmth: number;
  /** Multiplier for glow alphas (particles, ripples). */
  glow: number;
  /** Multiplier for ambient drift speed. */
  drift: number;
}

const MOODS: Mood[] = [
  { key: "night", label: "night mode", warmth: 0.85, glow: 1.1, drift: 1 },
  { key: "dawn", label: "dawn mode", warmth: 0.6, glow: 0.8, drift: 0.7 },
  { key: "day", label: "day mode", warmth: 0.25, glow: 0.9, drift: 1.15 },
  { key: "dusk", label: "dusk mode", warmth: 1, glow: 1.2, drift: 0.85 },
];

function keyFor(hours: number): MoodKey {
  if (hours >= 5 && hours < 8) return "dawn";
  if (hours >= 8 && hours < 17) return "day";
  if (hours >= 17 && hours < 20) return "dusk";
  return "night";
}

export function getMood(date: Date = new Date()): Mood {
  const key = keyFor(date.getHours() + date.getMinutes() / 60);
  return MOODS.find((mood) => mood.key === key) ?? MOODS[0];
}
