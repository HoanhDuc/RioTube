export interface IBaseList {
  kind: string;
  etag: string;
  nextPageToken: string;
  pageInfo: PageInfo;
}

export interface INewFeedList extends IBaseList {
  items: INewFeedItem[];
}

export interface ISearchList extends IBaseList {
  items: IVideoItem[];
}

export interface IVideoItem {
  kind: string;
  etag: string;
  id: {
    videoId: string;
    kind: string;
  };
  snippet: Snippet;
  statistics: Statistics;
}

export interface INewFeedItem {
  kind: string;
  etag: string;
  id: string;
  snippet: Snippet;
  statistics: Statistics;
}

export interface Snippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: Thumbnails;
  channelTitle: string;
  categoryId: string;
  liveBroadcastContent: string;
  localized: Localized;
  defaultAudioLanguage?: string;
  tags?: string[];
  defaultLanguage?: string;
}

export interface Statistics {
  viewCount?: string;
  subscriberCount?: string;
}

export interface Thumbnails {
  default: Default;
  medium: Medium;
  high: High;
  standard: Standard;
  maxres: Maxres;
}

export interface Default {
  url: string;
  width: number;
  height: number;
}

export interface Medium {
  url: string;
  width: number;
  height: number;
}

export interface High {
  url: string;
  width: number;
  height: number;
}

export interface Standard {
  url: string;
  width: number;
  height: number;
}

export interface Maxres {
  url: string;
  width: number;
  height: number;
}

export interface Localized {
  title: string;
  description: string;
}

export interface PageInfo {
  totalResults: number;
  resultsPerPage: number;
}

export interface IChannelList {
  kind: string;
  etag: string;
  pageInfo: PageInfo;
  items: IChannelItem[];
}

export interface IChannelItem {
  kind: string;
  etag: string;
  id: string;
  snippet: SnippetChannel;
  statistics: Statistics;
}

export interface SnippetChannel {
  title: string;
  description: string;
  customUrl: string;
  publishedAt: string;
  thumbnails: Thumbnails;
  localized: Localized;
  country?: string;
  defaultLanguage?: string;
}
