import axios from "@/apis/axios";
import { IChannelList, INewFeedList, ISearchList } from "@/interfaces/youtube";

const PATH_VIDEO = "/videos";
const PATH_CHANNEL = "/channels";
const PATH_SEARCH = "/search";

export async function getYouTubeFeed(params: {
  part?: string;
  chart?: string;
  maxResults?: number;
  regionCode?: string;
  videoCategoryId?: string;
  pageToken?: string;
  hl?: string;
  locale?: string;
  relevanceLanguage?: string;
  publishedBefore?: string;
  publishedAfter?: string;
  videoDuration?: string;
  videoEmbeddable?: boolean;
  videoLicense?: string;
  videoType?: string;
  videoRating?: string;
  videoSyndicated?: boolean;
  videoDimension?: "2d" | "3d";
  videoCaption?: "closedCaption" | "none" | "any";
  videoDefinition?: "high" | "standard";
}): Promise<INewFeedList> {
  try {
    const response = await axios.get(`${PATH_VIDEO}`, {
      params: {
        ...params,
        part: "snippet,contentDetails,statistics",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
export async function getChannelInfo(params: {
  id?: string;
  type?: string;
}): Promise<IChannelList> {
  try {
    const response = await axios.get(`${PATH_CHANNEL}`, {
      params: {
        ...params,
        part: "snippet,contentDetails,statistics",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function searchVideos(params: {
  q: string;
  maxResults: number;
  pageToken: string;
}): Promise<ISearchList> {
  try {
    const response = await axios.get(`${PATH_SEARCH}`, {
      params: {
        ...params,
        part: "snippet",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function getVideoInfo(params: {
  id: string;
}): Promise<INewFeedList> {
  try {
    const response = await axios.get(`${PATH_VIDEO}`, {
      params: {
        ...params,
        part: "snippet,contentDetails,statistics",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
