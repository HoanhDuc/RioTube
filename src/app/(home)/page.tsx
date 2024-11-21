"use client";

import { getChannelInfo, getYouTubeFeed, getVideoInfo } from "@/apis/youtube";
import { IChannelItem, INewFeedList } from "@/interfaces/youtube";
import { useEffect, useId, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { formatViewCount } from "@/utils/format";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { AnimatePresence, motion } from "framer-motion";
import { VideoModal } from "@/components/VideoModal";
import { VideoCard } from "@/components/VideoCard";
import { ICardVideo } from "@/interfaces/video";

export default function Home() {
  const [newFeedList, setNewFeedList] = useState<INewFeedList | null>(null);
  const [channelInfo, setChannelInfo] = useState<{
    [key: string]: IChannelItem;
  }>({});
  const [active, setActive] = useState<ICardVideo | boolean | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => fetchDataNewFeed(), []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  const fetchDataNewFeed = () => {
    getYouTubeFeed({
      chart: "mostPopular",
      maxResults: 20,
    }).then((data) => {
      const videoIds = data.items.map((item) => item.id).join(",");

      getVideoInfo({
        id: videoIds,
      }).then((videoData) => {
        const mergedData = {
          ...data,
          items: data.items.map((item) => {
            const videoStats = videoData.items.find(
              (v: { id: string }) => v.id === item.id
            );
            return {
              ...item,
              statistics: videoStats?.statistics,
            };
          }),
        };
        setNewFeedList(mergedData as INewFeedList);
      });

      const channelIds = [
        ...new Set(data.items.map((item) => item.snippet.channelId)),
      ];
      getChannelInfo({
        id: channelIds.join(","),
        type: "channel",
      }).then((channelData) => {
        const channelMap = channelData.items.reduce(
          (acc: { [key: string]: typeof channel }, channel) => {
            acc[channel.id] = channel;
            return acc;
          },
          {}
        );
        setChannelInfo(channelMap);
      });
    });
  };

  const videoCards: ICardVideo[] =
    newFeedList?.items.map((item) => ({
      title: item.snippet.title,
      description: "",
      src: item.snippet.thumbnails.high.url,
      ctaText: formatViewCount(item.statistics?.viewCount || "0"),
      channelAvatar:
        channelInfo[item.snippet.channelId]?.snippet.thumbnails.high.url,
      channelName: channelInfo[item.snippet.channelId]?.snippet.title,
      ctaLink: `https://www.youtube.com/watch?v=${item.id}`,
      channelSubscribers:
        channelInfo[item.snippet.channelId]?.statistics.subscriberCount || "0",
      publishedAt: formatDistanceToNow(new Date(item.snippet.publishedAt)),
      content: () => (
        <>
          <p>{item.snippet.description}</p>
          <p>
            Published {formatDistanceToNow(new Date(item.snippet.publishedAt))}{" "}
            ago
          </p>
          <p>{formatViewCount(item.statistics?.viewCount || "0")}</p>
        </>
      ),
    })) || [];

  return (
    <>
      <>
        <AnimatePresence>
          {active && typeof active === "object" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 h-full w-full z-10"
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {active && typeof active === "object" ? (
            <VideoModal
              active={active}
              id={id}
              onClose={() => setActive(null)}
              modalRef={ref}
            />
          ) : null}
        </AnimatePresence>
        <ul className="mx-auto w-full grid grid-cols-4 gap-4">
          {videoCards.map((card) => (
            <VideoCard
              key={`card-${card.title}-${id}`}
              card={card}
              id={id}
              onCardClick={(card) => setActive(card)}
            />
          ))}
        </ul>
      </>
    </>
  );
}
