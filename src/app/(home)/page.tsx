"use client";

import Image from "next/image";
import Link from "next/link";

// import { getChannelInfo, getYouTubeFeed, getVideoInfo } from "@/apis/youtube";
// import { IChannelItem, INewFeedList } from "@/interfaces/youtube";
// import { useEffect, useId, useRef, useState } from "react";
// import { formatDistanceToNow } from "date-fns";
// import { formatViewCount } from "@/utils/format";
// import { useOutsideClick } from "@/hooks/use-outside-click";
// import { AnimatePresence, motion } from "framer-motion";
// import { VideoModal } from "@/components/VideoModal";
// import { VideoCard } from "@/components/VideoCard";
// import { ICardVideo } from "@/interfaces/video";
// import VideoCardSkeleton from "@/components/VideoCardSkeleton";
// import Image from "next/image";

// export default function Home() {
//   const [newFeedList, setNewFeedList] = useState<INewFeedList | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [channelInfo, setChannelInfo] = useState<{
//     [key: string]: IChannelItem;
//   }>({});
//   const [active, setActive] = useState<ICardVideo | boolean | null>(null);
//   const ref = useRef<HTMLDivElement>(null);
//   const id = useId();

//   useEffect(() => {
//     fetchDataNewFeed();
//   }, []);

//   useEffect(() => {
//     function onKeyDown(event: KeyboardEvent) {
//       if (event.key === "Escape") {
//         setActive(false);
//       }
//     }
//     if (active && typeof active === "object") {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "auto";
//     }

//     window.addEventListener("keydown", onKeyDown);
//     return () => window.removeEventListener("keydown", onKeyDown);
//   }, [active]);

//   useOutsideClick(ref, () => setActive(null));

//   const fetchDataNewFeed = async () => {
//     try {
//       setIsLoading(true);
//       const data = await getYouTubeFeed({
//         chart: "mostPopular",
//         maxResults: 4,
//       });
//       const videoIds = data.items.map((item) => item.id).join(",");
//       const channelIds = [
//         ...new Set(data.items.map((item) => item.snippet.channelId)),
//       ];
//       const [videoData, channelData] = await Promise.all([
//         getVideoInfo({ id: videoIds }),
//         getChannelInfo({ id: channelIds.join(","), type: "channel" }),
//       ]);
//       const mergedData = {
//         ...data,
//         items: data.items.map((item) => ({
//           ...item,
//           statistics: videoData.items.find(
//             (v: { id: string }) => v.id === item.id
//           )?.statistics,
//         })),
//       };

//       const channelMap = channelData.items.reduce(
//         (acc: { [key: string]: typeof channel }, channel) => {
//           acc[channel.id] = channel;
//           return acc;
//         },
//         {}
//       );

//       setNewFeedList(mergedData as INewFeedList);
//       setChannelInfo(channelMap);
//     } catch (error) {
//       console.error("Error fetching feed:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const videoCards: ICardVideo[] =
//     newFeedList?.items.map((item) => ({
//       title: item.snippet.title,
//       description: "",
//       src: item.snippet.thumbnails.high.url,
//       ctaText: formatViewCount(item.statistics?.viewCount || "0"),
//       channelAvatar:
//         channelInfo[item.snippet.channelId]?.snippet.thumbnails.high.url,
//       channelName: channelInfo[item.snippet.channelId]?.snippet.title,
//       ctaLink: `https://www.youtube.com/watch?v=${item.id}`,
//       channelSubscribers:
//         channelInfo[item.snippet.channelId]?.statistics.subscriberCount || "0",
//       publishedAt: formatDistanceToNow(new Date(item.snippet.publishedAt)),
//       content: () => (
//         <>
//           <p>{item.snippet.description}</p>
//           <p>
//             Published {formatDistanceToNow(new Date(item.snippet.publishedAt))}{" "}
//             ago
//           </p>
//           <p>{formatViewCount(item.statistics?.viewCount || "0")}</p>
//         </>
//       ),
//     })) || [];

//   return (
//     <>
//       <AnimatePresence>
//         {active && typeof active === "object" && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/20 h-full w-full z-10"
//           />
//         )}
//       </AnimatePresence>
//       <AnimatePresence>
//         {active && typeof active === "object" ? (
//           <VideoModal
//             active={active}
//             id={id}
//             onClose={() => setActive(null)}
//             modalRef={ref}
//           />
//         ) : null}
//       </AnimatePresence>
//       {isLoading || videoCards.length ? (
//         <ul className="mx-auto w-full grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-4">
//           {videoCards.map((card) => (
//             <VideoCard
//               key={`card-${card.title}-${id}`}
//               card={card}
//               id={id}
//               onCardClick={(card) => setActive(card)}
//             />
//           ))}
//           {Array.from({ length: 4 }).map((_, index) => (
//             <VideoCardSkeleton key={`skeleton-${index}`} />
//           ))}
//         </ul>
//       ) : (
//         <div className=" flex justify-center items-center">
//           <Image src="/no-video.svg" alt="No video" width={200} height={200} />
//         </div>
//       )}
//     </>
//   );
// }
export default function Home() {
  return (
    <div className="bg-primary flex flex-col m-20 p-10 rounded-xl text-white">
      <div className="text-6xl font-bold mb-5 flex items-center gap-1">
        <Image
          src="/logo.svg"
          alt="Rio"
          loading="lazy"
          width={60}
          height={60}
        />
        <p className="text-secondary">Rio</p>{" "}
        <span className="text-4xl  font-light px-4 italic tracking-tighter">
          ×
        </span>
        <div className="flex items-center gap-2">
          <svg
            className="w-[55px] h-[55px]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              fill="#ff0000"
              d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"
            />
          </svg>
          <span className="text-white ml-1">YouTube</span>
        </div>
      </div>
      <p className="text-xl">
        RioTube is a platform for watching and sharing videos from YouTube.
      </p>
      <p className="text-xl">
        You can search for videos, channels and playlists by using the search
        bar above.
      </p>

      <Link
        href="/results?search_query=top%20trending"
        className="mt-6 px-6 py-3 border border-secondary text-secondary rounded-lg hover:bg-secondary hover:text-white transition-all w-fit"
      >
        Explore Top Videos
      </Link>
    </div>
  );
}
