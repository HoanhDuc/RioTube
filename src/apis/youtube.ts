import axios from "@/apis/axios";
import {
  IChannelInfoList,
  INewFeedList,
  ISearchList,
  ISubscriptionList,
  IVideoInfoList,
} from "@/interfaces/youtube";

const PATH_VIDEO = "/videos";
const PATH_CHANNEL = "/channels";
const PATH_SEARCH = "/search";
const PATH_SUBSCRIPTION = "/subscriptions";

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
}): Promise<IChannelInfoList> {
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
}): Promise<IVideoInfoList> {
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
export async function getSubscriptionStatus({
  channelId,
}: {
  channelId: string;
}): Promise<ISubscriptionList> {
  try {
    const response = await axios.get(`${PATH_SUBSCRIPTION}`, {
      params: {
        part: "snippet",
        forChannelId: channelId,
        mine: true,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error checking subscription status:", error);
    throw error;
  }
}
