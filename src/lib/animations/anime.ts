import { createTimeline, createTimer, type Timeline, type Timer } from "animejs";

export interface AnimeTimelineOptions {
  ease?: string;
  duration?: number;
  [key: string]: unknown;
}

const DEFAULTS: AnimeTimelineOptions = {
  ease: "outExpo",
  duration: 800,
};

export function createAnimeTimeline(
  options: AnimeTimelineOptions = {}
): Timeline {
  return createTimeline({
    ...DEFAULTS,
    ...options,
  });
}

export function createAnimeTimer(
  options: AnimeTimelineOptions = {}
): Timer {
  return createTimer({
    ...DEFAULTS,
    ...options,
  });
}

export { createTimeline, createTimer };
export type { Timeline, Timer };
