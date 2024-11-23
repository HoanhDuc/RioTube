import { ICardVideo } from "@/interfaces/video";
import { formatViewCount } from "@/utils/format";
import { formatSubscribersCount } from "@/utils/format";
import { Avatar } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  card: ICardVideo;
}

export function VideoModal({
  isOpen,
  onClose,
  videoId,
  card,
}: VideoModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/75 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 bg-black z-50 flex justify-center items-start p-5 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <button
              onClick={onClose}
              className="sticky top-0 z-50 text-secondary rounded-full mr-5"
            >
              <motion.svg
                whileHover={{ x: -5 }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-12 h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </motion.svg>
            </button>
            <div className="w-full h-full lg:flex gap-8 text-white">
              <div className="lg:w-2/3">
                <iframe
                  className="w-full h-[250px] md:h-[400px] lg:h-2/3 border border-primary rounded-lg mb-3 md:mb-5"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&controls=1&modestbranding=1&playsinline=1&rel=0&enablejsapi=1`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <div className="flex flex-col gap-2 lg:gap-3">
                  <motion.h3
                    layoutId={`title-${card.title}-${videoId}`}
                    className=" line-clamp-2 text-lg md:text-2xl font-bold"
                  >
                    {card.title} | {card.channelName}
                  </motion.h3>
                  <motion.p
                    layoutId={`description-${card.ctaText}-${videoId}`}
                    className="text-neutral-400 text-sm whitespace-nowrap flex gap-2 items-center"
                  >
                    {formatViewCount(card.ctaText)} Views - Published on{" "}
                    {card.publishedAt} ago
                  </motion.p>
                  <div className="flex gap-2 items-center">
                    <div>
                      <Avatar src={card.channelAvatar} />
                    </div>
                    <div className="w-2/3">
                      <p className="font-bold truncate">{card.channelName}</p>
                      <p className="text-xs text-neutral-400 flex items-center gap-1">
                        {formatSubscribersCount(card.channelSubscribers)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/3 p-5 border border-primary rounded-lg h-fit">
                <p className="text-secondary text-xl lg:text-2xl font-bold">
                  Comments
                </p>
                <div className="my-2 bg-primary h-[1px]" />
                <div className="max-h-[600px] overflow-y-auto">
                  {Array.from({ length: 20 }).map((_, index) => (
                    <div key={index} className="border-b border-primary py-5">
                      <div className="flex gap-2 items-center">
                        <Avatar src={card.channelAvatar} />
                        <p className="text-white font-bold">
                          {card.channelName}
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
        </>
      )}
    </AnimatePresence>
  );
}
