"use client";

import { useState, useEffect, useCallback, useId } from "react";
import { getChannelInfo, searchVideos, getVideoInfo } from "@/apis/youtube";
import { useSearchParams } from "next/navigation";
import { IChannelItem, IVideoItem } from "@/interfaces/youtube";
import { VideoCard } from "@/components/VideoCard";
import { formatDistanceToNow } from "date-fns";
import { formatViewCount } from "@/utils/format";
import { ICardVideo } from "@/interfaces/video";

export default function ResultsPage() {
  const [videos, setVideos] = useState<IVideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageToken, setPageToken] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [channelInfo, setChannelInfo] = useState<{
    [key: string]: IChannelItem;
  }>({});

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search_query") || "";

  const id = useId();

  const fetchVideoData = useCallback(
    async (searchParams: {
      q: string;
      maxResults: number;
      pageToken: string;
    }) => {
      const results = await searchVideos(searchParams);

      const videoIds = results.items.map((item: IVideoItem) => item.id.videoId);
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
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const { mergedVideos, nextPageToken } = await fetchVideoData({
          q: searchQuery,
          maxResults: 20,
          pageToken: "",
        });

        setVideos(mergedVideos);
        setPageToken(nextPageToken);
        setHasMore(!!nextPageToken);

        const newChannelMap = await fetchChannelData(mergedVideos);
        setChannelInfo(newChannelMap);
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
      setPageToken(null);
      setHasMore(true);
      fetchInitialData();
    }
  }, [searchQuery, fetchVideoData, fetchChannelData]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;

    try {
      setLoading(true);
      const { mergedVideos, nextPageToken } = await fetchVideoData({
        q: searchQuery,
        maxResults: 10,
        pageToken: pageToken || "",
      });

      setVideos((prev) => [...prev, ...mergedVideos]);
      setPageToken(nextPageToken);
      setHasMore(!!nextPageToken);

      const newChannelMap = await fetchChannelData(mergedVideos);
      setChannelInfo((prev) => ({ ...prev, ...newChannelMap }));
    } catch (err) {
      setError("Failed to fetch more videos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [
    hasMore,
    loading,
    pageToken,
    searchQuery,
    fetchVideoData,
    fetchChannelData,
  ]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    const sentinel = document.getElementById("scroll-sentinel");
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, pageToken, loadMore]);

  const videoCards: ICardVideo[] = videos.map((video) => ({
    title: video.snippet.title,
    description: video.snippet.description,
    src: video.snippet.thumbnails.medium.url,
    ctaText: video.statistics?.viewCount
      ? formatViewCount(video.statistics.viewCount)
      : "0 views",
    channelAvatar:
      channelInfo[video.snippet.channelId]?.snippet.thumbnails.default.url,
    channelName: video.snippet.channelTitle,
    ctaLink: `/watch?v=${video.id.videoId}`,
    channelSubscribers:
      channelInfo[video.snippet.channelId]?.statistics.subscriberCount || "0",
    publishedAt: formatDistanceToNow(new Date(video.snippet.publishedAt)),
    content: () => (
      <>
        <p>{video.snippet.description}</p>
        <p>
          Published {formatDistanceToNow(new Date(video.snippet.publishedAt))}{" "}
          ago
        </p>
        <p>
          {video.statistics?.viewCount
            ? formatViewCount(video.statistics.viewCount)
            : "0"}{" "}
          views
        </p>
      </>
    ),
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Search Results for: {searchQuery}
      </h1>

      <ul className="grid grid-cols-4 gap-4">
        {videoCards.map((card, index) => (
          <VideoCard key={`card-${id}-${index}`} card={card} id={id} />
        ))}
      </ul>

      {hasMore && (
        <div
          id="scroll-sentinel"
          className="flex justify-center items-center py-4"
        >
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}

      {videos.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-600">
            No videos found for &quot;{searchQuery}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
