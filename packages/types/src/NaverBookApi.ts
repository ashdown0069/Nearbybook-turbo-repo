export interface NaverBookAdvItem {
  title: string;
  link: string;
  image: string;
  author: string;
  discount: number;
  publisher: string;
  pubdate: number;
  isbn: number;
  description: string;
}

export interface NaverBookAdvChannel {
  title: string;
  link: string;
  description: string;
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  item: NaverBookAdvItem;
}

export interface NaverBookAdvRss {
  channel: NaverBookAdvChannel;
}

export interface NaverBookAdvResponse {
  "?xml": string;
  rss: NaverBookAdvRss;
}
