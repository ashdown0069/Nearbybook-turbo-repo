export const REDIS_CLIENT = 'REDIS_CLIENT' as const;

export const QUEUE_NAMES = {
  POPULARITY: 'popularity',
} as const;

export const REDIS_KEYS = {
  POPULARITY_COUNT: 'popularity:count',
  POPULARITY_META: 'popularity:meta',
  POPULARITY_COUNT_PROCESSING: 'popularity:count:processing',
  POPULARITY_META_PROCESSING: 'popularity:meta:processing',
};
