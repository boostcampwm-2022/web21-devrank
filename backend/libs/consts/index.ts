const MINUTE = 60;
export const HOUR = 60 * MINUTE;

export const DAY = 24 * HOUR;

export const WEEK = 7 * DAY;

export const MONTH = 30 * DAY;

export const YEAR = 365 * DAY;

export const EXPIRATION = {
  ACCESS_TOKEN: 600,
  REFRESH_TOKEN: 1296000,
} as const;

export const UPDATE_DELAY_TIME = 2 * MINUTE;

export const PAGE_UNIT_COUNT = 10;

export const RANK_CACHE_DELAY = 12 * HOUR;

export const GITHUB_API_DELAY = 1500; // ms

export const KR_TIME_DIFF = 9 * HOUR * 1000; // ms
