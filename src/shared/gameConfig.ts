export const GAME_DURATION_OPTIONS = [10, 30, 60] as const;
export type GameDuration = (typeof GAME_DURATION_OPTIONS)[number];

export const GAME_CONFIG = {
  DURATION_SECONDS: 30,
  COUNTDOWN_MS: 3000,
  COUNTDOWN_VALUE: 3,
  TICK_INTERVAL_MS: 1000,
  NO_MISS_BONUS: 10,
  FLASH_DURATION_MS: 80,
} as const;
