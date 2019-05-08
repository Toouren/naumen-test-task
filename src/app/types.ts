export interface IUrl {
  urlString: string;
  locale: string;
  request: string;
}

export interface IWikiRequest {
  locale?: string;
  request?: string;
  sroffset?: number;
  srlimit?: number;
}

export interface ISearchRequest {
  request: string;
  locale: string;
}

export interface ILocale {
  shortForm: string;
  normalForm: string;
}

export interface IWikiResponse {
  batchcomplete?: string;
  continue?: ContinueBlock;
  query?: QueryBlock;
  error?: ErrorBlock;
  serverdby?: string;
}

interface ContinueBlock {
  continue?: string;
  sroffset?: number;
}

interface QueryBlock {
  search: FoundBlock[];
  searchinfo: SearchInfo;
}

interface FoundBlock {
  ns: number;
  title: string;
  pageid: number;
  size: number;
  snippet: string;
  timestamp: string;
  wordcount: number;
  linkToPage?: string;
}

interface SearchInfo {
  totalhits: number;
}

interface ErrorBlock {
  code: string;
  info: string;
}
