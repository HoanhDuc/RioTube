"use client";

import { useState, useEffect, useCallback, useId, Suspense } from "react";
import { getChannelInfo, searchVideos, getVideoInfo } from "@/apis/youtube";
import { useSearchParams } from "next/navigation";
import { IChannelItem, IVideoItem } from "@/interfaces/youtube";
import { VideoCard } from "@/components/VideoCard";
import { formatDistanceToNow } from "date-fns";
import { formatViewCount } from "@/utils/format";
import { ICardVideo } from "@/interfaces/video";
import { VideoModal } from "@/components/VideoModal";
import VideoCardSkeleton from "@/components/VideoCardSkeleton";
import Logo from "@/ui/logo";
import ChannelCard from "@/components/ChannelCard";

function ResultsContent() {
  const [videos, setVideos] = useState<IVideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageToken, setPageToken] = useState<string | null>(null);
  const [channelsLivingStream, setChannelsLivingStream] = useState<string[]>(
    []
  );
  const [hasMore, setHasMore] = useState(true);
  const [channelInfo, setChannelInfo] = useState<{
    [key: string]: IChannelItem;
  }>({});
  const [selectedVideoId, setSelectedVideoId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const { mergedVideos, nextPageToken } = await fetchVideoData({
          q: searchQuery,
          maxResults: 9,
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
    setLoading(true);
    setTimeout(async () => {
      if (!hasMore || loading) return;
      try {
        const { mergedVideos, nextPageToken } = await fetchVideoData({
          q: searchQuery,
          maxResults: 9,
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
    }, 1000);
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

  const videoCards: ICardVideo[] = videos
    .filter((video) => video.id.kind === "youtube#video")
    .map((video) => ({
      title: video.snippet.title,
      description: video.snippet.description,
      src: video.snippet.thumbnails.high.url,
      ctaText: video.statistics?.viewCount
        ? formatViewCount(video.statistics.viewCount)
        : "0 views",
      channelAvatar:
        channelInfo[video.snippet.channelId]?.snippet.thumbnails.high.url,
      channelName: video.snippet.channelTitle,
      ctaLink: `/watch?v=${video.id.videoId}`,
      channelSubscribers:
        channelInfo[video.snippet.channelId]?.statistics.subscriberCount || "0",
      publishedAt: formatDistanceToNow(new Date(video.snippet.publishedAt)),
      videoId: video.id.videoId,
      isLiveStream: video.snippet.liveBroadcastContent === "live",
    }));

  const channelCards = videos
    .filter((video) => video.id.kind === "youtube#channel")
    .map((video) => ({
      name: video.snippet.title,
      description: video.snippet.description,
      imageUrl: video.snippet.thumbnails.default.url,
      subscriberCount:
        channelInfo[video.snippet.channelId]?.statistics.subscriberCount,
      isLiveStream: channelsLivingStream.includes(video.snippet.channelId),
    }));

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="p-5 bg-primary rounded-xl text-white mb-6">
        <h1 className="lg:text-2xl font-bold">
          Search Results for:{" "}
          <span className="text-secondary">{searchQuery}</span>
        </h1>
      </div>
      {/* Channel */}
      {channelCards.length && (
        <div className="mb-6">
          <div className="text-xl font-bold text-white mb-3">Channel</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {channelCards.map((card, index) => (
              <ChannelCard key={`card-${id}-${index}`} card={card} />
            ))}
          </div>
        </div>
      )}
      {/* Videos */}
      <div>
        <div className="text-xl font-bold text-white mb-3">Videos</div>
        <ul className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
          {videoCards.map((card, index) => (
            <VideoCard
              key={`card-${id}-${index}`}
              card={card}
              id={id}
              onCardClick={() => {
                setSelectedVideoId(card.videoId || "");
                setIsModalOpen(true);
              }}
            />
          ))}
          {loading &&
            !videos.length &&
            Array.from({ length: 3 }).map((_, index) => (
              <VideoCardSkeleton key={`skeleton-${index}`} />
            ))}
        </ul>
        {videos.length && hasMore && (
          <div
            id="scroll-sentinel"
            className="flex items-center justify-center w-full gap-2 py-4"
          >
            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            <p className="text-white">Loading more videos...</p>
          </div>
        )}
      </div>

      {videos.length === 0 && !loading && (
        <div className="text-xl text-center py-12">
          <p className="text-red-500">
            No videos found for &quot;{searchQuery}&quot;
          </p>
        </div>
      )}

      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoId={selectedVideoId}
      />
    </div>
  );
}

// Main page component
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
