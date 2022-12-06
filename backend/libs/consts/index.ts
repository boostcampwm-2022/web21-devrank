const MINUTE = 60;
const HOUR = 60 * MINUTE;

export const EXPIRATION = {
  ACCESS_TOKEN: 600,
  REFRESH_TOKEN: 1296000,
} as const;

export const UPDATE_DELAY_TIME = 2 * MINUTE;

export const PAGE_UNIT_COUNT = 10;

export const RANK_CACHE_DELAY = 12 * HOUR;

export const GITHUB_API_DELAY = 1500; // ms
