"use client";

import { useState, useEffect, useCallback, useId, Suspense } from "react";
import {
  getChannelInfo,
  searchVideos,
  getVideoInfo,
  getSubscriptionStatus,
} from "@/apis/youtube";
import { useSearchParams } from "next/navigation";
import { IChannelItem, IVideoItem } from "@/interfaces/youtube";
import { VideoCard } from "@/components/VideoCard";
import { formatDistanceToNow } from "date-fns";
import { ICardVideo, IChannelCard } from "@/interfaces/video";
import VideoCardSkeleton from "@/components/VideoCardSkeleton";
import Logo from "@/ui/logo";
import ChannelCard from "@/components/ChannelCard";
import Link from "next/link";
import { Skeleton } from "@nextui-org/react";

function ResultsContent() {
  const [videos, setVideos] = useState<IVideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [pageToken, setPageToken] = useState<string | null>(null);
  const [channelsLivingStream, setChannelsLivingStream] = useState<string[]>(
    []
  );
  // const [hasMore, setHasMore] = useState(true);
  const [channelInfo, setChannelInfo] = useState<{
    [key: string]: IChannelItem;
  }>({});
  const [subscribedChannels, setSubscribedChannels] = useState<string[]>([]);

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search_query") || "";
  const maxResults = 48;
  const cacheKey = `youtube-${searchQuery}`;

  const id = useId();

  const fetchVideoData = useCallback(
    async (searchParams: {
      q: string;
      maxResults: number;
      pageToken: string;
    }) => {
      const results = await searchVideos(searchParams);

      setChannelsLivingStream(
        results.items
          .filter(
            (item: IVideoItem) => item.snippet.liveBroadcastContent === "live"
          )
          .map((item: IVideoItem) => item.snippet.channelId)
      );

      const videoIds = results.items.map((item: IVideoItem) => item.id.videoId);
      if (!videoIds.length) return { mergedVideos: [], nextPageToken: "" };
      const videoDetails = await getVideoInfo({
        id: videoIds.join(","),
      });

      const mergedVideos = results.items.map((video: IVideoItem) => {
        const details = videoDetails.items.find(
          (v) => v.id === video.id.videoId
        );
        return {
          ...video,
          statistics: details?.statistics || {},
        };
      });

      return { mergedVideos, nextPageToken: results.nextPageToken };
    },
    []
  );

  const fetchChannelData = useCallback(async (videos: IVideoItem[]) => {
    const channelIds = [
      ...new Set(videos.map((item) => item.snippet.channelId)),
    ];
    if (!channelIds.length) return {};

    const channelData = await getChannelInfo({
      id: channelIds.join(","),
      type: "channel",
    });

    return channelData.items.reduce(
      (acc: { [key: string]: IChannelItem }, channel) => {
        acc[channel.id] = channel;
        return acc;
      },
      {}
    );
  }, []);

  useEffect(() => {
    const cachedData = localStorage.getItem(cacheKey);
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const { mergedVideos } = await fetchVideoData({
          q: searchQuery,
          maxResults,
          pageToken: "",
        });
        const newChannelMap = await fetchChannelData(mergedVideos);
        const channelIds = Object.keys(newChannelMap);

        const statuses = await getSubscriptionStatus({
          channelId: channelIds.join(","),
        });
        const newSubscribedChannels = statuses.items
          .map((item) => item.snippet.resourceId?.channelId)
          .filter((id) => id) as string[];

        setVideos(mergedVideos);
        setChannelInfo(newChannelMap);
        setSubscribedChannels(newSubscribedChannels);

        const cacheData = {
          videos: mergedVideos,
          channelInfo: newChannelMap,
          subscribes: newSubscribedChannels,
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));

        setError(null);
      } catch (err) {
        setError("Failed to fetch videos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      setVideos([]);
      if (cachedData) {
        setLoading(false);
        const parseCached = JSON.parse(cachedData);
        setVideos(parseCached.videos);
        setChannelInfo(parseCached.channelInfo);
        setSubscribedChannels(parseCached.subscribes);
        return;
      }
      fetchInitialData();
    }
  }, [searchQuery, fetchVideoData, fetchChannelData]);

  // const loadMore = useCallback(async () => {
  //   setLoading(true);
  //   setTimeout(async () => {
  //     if (!hasMore || loading) return;
  //     try {
  //       const { mergedVideos, nextPageToken } = await fetchVideoData({
  //         q: searchQuery,
  //         maxResults,
  //         pageToken: pageToken || "",
  //       });
  //       setVideos((prev) => [...prev, ...mergedVideos]);
  //       setPageToken(nextPageToken);
  //       setHasMore(!!nextPageToken);
  //       const newChannelMap = await fetchChannelData(mergedVideos);
  //       setChannelInfo((prev) => ({ ...prev, ...newChannelMap }));
  //     } catch (err) {
  //       setError("Failed to fetch more videos");
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }, 1000);
  // }, [
  //   hasMore,
  //   loading,
  //   pageToken,
  //   searchQuery,
  //   fetchVideoData,
  //   fetchChannelData,
  // ]);

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       if (entries[0].isIntersecting && hasMore && !loading) {
  //         loadMore();
  //       }
  //     },
  //     { threshold: 1.0 }
  //   );

  //   const sentinel = document.getElementById("scroll-sentinel");
  //   if (sentinel) {
  //     observer.observe(sentinel);
  //   }

  //   return () => observer.disconnect();
  // }, [hasMore, loading, pageToken, loadMore]);

  const videoCards: ICardVideo[] = videos
    .filter((video) => video.id.kind === "youtube#video")
    .map((video) => ({
      title: video.snippet.title,
      description: video.snippet.description,
      src: video.snippet.thumbnails.high.url,
      ctaText: video.statistics?.viewCount || "0",
      channelAvatar:
        channelInfo[video.snippet.channelId]?.snippet.thumbnails.high.url,
      channelName: video.snippet.channelTitle,
      ctaLink: `/watch?v=${video.id.videoId}`,
      channelSubscribers:
        channelInfo[video.snippet.channelId]?.statistics.subscriberCount || "0",
      publishedAt: formatDistanceToNow(new Date(video.snippet.publishedAt)),
      videoId: video.id.videoId,
      isLiveStream: video.snippet.liveBroadcastContent === "live",
      isSubscribed: subscribedChannels.includes(video.snippet.channelId),
    }));

  const channelCards: IChannelCard[] = videos
    .filter((video) => video.id.kind === "youtube#channel")
    .map((video) => ({
      name: video.snippet.title,
      description: video.snippet.description,
      imageUrl: video.snippet.thumbnails.default.url,
      subscriberCount:
        channelInfo[video.snippet.channelId]?.statistics.subscriberCount || "0",
      isLiveStream: channelsLivingStream.includes(video.snippet.channelId),
      isSubscribed: subscribedChannels.includes(video.snippet.channelId),
    }));

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      console.log(event);
      if (window.opener === null && window.history.length === 1) {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith("youtube-")) {
            localStorage.removeItem(key);
          }
        });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-5 py-8">
      <div className="p-5 bg-primary rounded-xl text-white mb-6">
        <h1 className="lg:text-2xl font-bold">
          Search Results for:{" "}
          <span className="text-secondary">{searchQuery}</span>
        </h1>
      </div>
      {/* Channel */}
      <div className="mb-6">
        <div className="text-xl font-bold text-white mb-3">Channel</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {channelCards.map((card, index) => (
            <ChannelCard key={`card-${id}-${index}`} card={card} />
          ))}
          {loading &&
            !channelCards.length &&
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="p-4 bg-primary rounded-xl"
              >
                <div className="flex gap-2">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="w-2/5 h-3 rounded-lg" />
                    <Skeleton className="w-2/5 h-3 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      {/* Videos */}
      <div>
        <div className="text-xl font-bold text-white mb-3">Videos</div>
        <ul className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-4">
          {videoCards.map((card, index) => (
            <Link
              href={`/youtube/watch?v=${card.videoId}`}
              key={`card-${id}-${index}`}
            >
              <VideoCard key={`card-${id}-${index}`} card={card} id={id} />
            </Link>
          ))}
          {loading &&
            !videos.length &&
            Array.from({ length: 4 }).map((_, index) => (
              <VideoCardSkeleton key={`skeleton-${index}`} />
            ))}
        </ul>
        {/* {videos.length && hasMore && (
          <div
            id="scroll-sentinel"
            className="flex items-center justify-center w-full gap-2 py-4"
          >
            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            <p className="text-white">Loading more videos...</p>
          </div>
        )} */}
      </div>

      {videos.length === 0 && !loading && (
        <div className="text-xl text-center py-12">
          <p className="text-red-500">
            No videos found for &quot;{searchQuery}&quot;
          </p>
        </div>
      )}
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <Logo />
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
