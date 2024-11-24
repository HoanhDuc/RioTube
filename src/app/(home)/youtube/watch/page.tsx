"use client";
import { getChannelInfo, getVideoInfo } from "@/apis/youtube";
import { ICardVideo } from "@/interfaces/video";
import { formatViewCount } from "@/utils/format";
import { formatSubscribersCount } from "@/utils/format";
import { Avatar } from "@nextui-org/react";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Suspense } from "react";

export default function WatchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WatchPageContent />
    </Suspense>
  );
}

function WatchPageContent() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get("v");
  const [videoDetails, setVideoDetails] = useState<ICardVideo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVideoInfo = async () => {
      setLoading(true);
      if (!videoId) return;
      const videoDetails = await getVideoInfo({
        id: videoId,
      });
      const channelData = await getChannelInfo({
        id: videoDetails.items[0].snippet.channelId,
        type: "channel",
      });
      console.log(videoDetails);
      const videoData = {
        title: videoDetails.items[0].snippet.title,
        description: videoDetails.items[0].snippet.description,
        src: videoDetails.items[0].snippet.thumbnails.high.url,
        ctaText: videoDetails.items[0].statistics?.viewCount || "0",
        channelAvatar: channelData.items[0]?.snippet.thumbnails.high.url,
        channelName: videoDetails.items[0].snippet.channelTitle,
        ctaLink: "1000",
        channelSubscribers:
          channelData.items[0]?.statistics.subscriberCount || "0",
        publishedAt: formatDistanceToNow(
          new Date(videoDetails.items[0].snippet.publishedAt)
        ),
        isLiveStream:
          videoDetails.items[0].snippet.liveBroadcastContent === "live",
        // isSubscribed: subscribedChannels.includes(
        //   videoDetails.items[0].snippet.channelId
        // ),
      };
      setVideoDetails(videoData);
      setLoading(false);
    };
    fetchVideoInfo();
  }, [videoId]);

  return (
    <AnimatePresence>
      <div>
        <motion.div
          className="h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
        <motion.div
          className="container px-5 mx-auto flex justify-center items-start p-5"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="w-full h-full lg:flex gap-8 text-white">
            <div className="lg:w-2/3">
              <iframe
                className="w-full h-[250px] md:h-[400px] lg:h-[500px] border border-primary rounded-lg mb-3 md:mb-5"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&controls=1&modestbranding=1&playsinline=1&rel=0&enablejsapi=1`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <div className="flex flex-col gap-2 lg:gap-3">
                {!loading ? (
                  <>
                    <motion.h3
                      layoutId={`title-${videoId}`}
                      className="line-clamp-2 text-lg md:text-2xl font-bold"
                    >
                      {videoDetails?.title} | {videoDetails?.channelName}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${videoId}`}
                      className="text-neutral-400 text-sm whitespace-nowrap flex gap-2 items-center"
                    >
                      {formatViewCount(videoDetails?.ctaText || "0")} Views -
                      Published on {videoDetails?.publishedAt} ago
                    </motion.p>
                  </>
                ) : (
                  <>
                    <h3 className="line-clamp-2 text-lg md:text-2xl font-bold">
                      Loading...
                    </h3>
                    <p className="text-neutral-400 text-sm whitespace-nowrap flex gap-2 items-center">
                      Loading...
                    </p>
                  </>
                )}
                <div className="flex gap-2 items-center">
                  <div>
                    <Avatar src={videoDetails?.channelAvatar} />
                  </div>
                  <div className="w-2/3">
                    <p className="font-bold truncate">
                      {videoDetails?.channelName}
                    </p>
                    <p className="text-xs text-neutral-400 flex items-center gap-1">
                      {formatSubscribersCount(
                        videoDetails?.channelSubscribers || "0"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/3 p-5 border border-primary rounded-lg h-[600px] overflow-y-auto">
              <p className="text-secondary text-xl lg:text-2xl font-bold">
                Comments
              </p>
              <div className="my-2 bg-primary h-[1px]" />
              <div className="max-h-[600px] overflow-y-auto">
                {Array.from({ length: 20 }).map((_, index) => (
                  <div
                    key={`${index}-ff`}
                    className="border-b border-primary py-5"
                  >
                    <div className="flex gap-2 items-center">
                      <Avatar src={videoDetails?.channelAvatar} />
                      <p className="text-white font-bold">
                        {videoDetails?.channelName}
                      </p>
                    </div>
                    <p className="text-white">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quisquam, quos.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
