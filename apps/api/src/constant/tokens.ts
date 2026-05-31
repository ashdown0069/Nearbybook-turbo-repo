export const REDIS_CLIENT = "REDIS_CLIENT" as const

export const QUEUE_NAMES = {
  POPULARITY: "popularity",
  SEARCH_LOG: "search-log", // 신규 추가할 검색 로그 배치 큐
} as const

export const REDIS_KEYS = {
  POPULARITY_COUNT: "popularity:count",
  POPULARITY_META: "popularity:meta",
  POPULARITY_COUNT_PROCESSING: "popularity:count:processing",
  POPULARITY_META_PROCESSING: "popularity:meta:processing",
  
  // 신규 검색 로그용 키
  SEARCH_LOG_DATES: "search:logs:dates", // 활성 날짜들이 담기는 Set
  SEARCH_LOG_DAILY_PREFIX: "search:logs:daily:", // 일자별 해시 키의 접두사
}
