import { motion } from "framer-motion";
import Image from "next/image";
import { ICardVideo } from "@/interfaces/video";
import { Avatar } from "@nextui-org/react";
import { formatSubscribersCount } from "@/utils/format";

export interface VideoCardProps {
  card: ICardVideo;
  id: string;
  onCardClick?: (card: ICardVideo) => void;
}

export const VideoCard = ({ card, id, onCardClick }: VideoCardProps) => {
  return (
    <motion.div
      layoutId={`card-${card.title}-${id}`}
      onClick={() => onCardClick && onCardClick(card)}
      className="rounded-xl cursor-pointer text-white bg-primary border border-transparent relative"
    >
      <motion.div layoutId={`image-${card.title}-${id}`}>
        <Image
          width={600}
          height={400}
          src={card.src}
          alt={card.title}
          className="object-cover object-center rounded-t-xl h-48"
        />
        {card.isLiveStream && (
          <motion.div
            initial={{ scale: 1 }}
            animate={{
              rotate: [-3, 3, 0, 0, 0, -3, 3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute top-2 left-2 bg-red-600 text-white px-2 py-0.5 rounded-md text-sm font-medium flex items-center gap-1"
          >
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            LIVE
          </motion.div>
        )}
      </motion.div>
      <div className="flex flex-col gap-4 justify-between p-4">
        <motion.h3
          layoutId={`title-${card.title}-${id}`}
          className=" line-clamp-2"
        >
          {card.title} | {card.channelName}
        </motion.h3>
        <div>
          <motion.p
            layoutId={`description-${card.ctaText}-${id}`}
            className="text-neutral-400 text-sm mb-3"
          >
            {card.ctaText} &bull; <span className="">{card.publishedAt}</span>
          </motion.p>
          <div className="flex gap-2 items-center">
            <Avatar src={card.channelAvatar} />
            <div className="w-2/3">
              <p className="font-bold truncate ">{card.channelName}</p>
              <p className="text-xs text-neutral-400">
                {formatSubscribersCount(card.channelSubscribers)}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* <motion.button
        layoutId={`button-${card.title}-${id}`}
        className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-secondary hover:text-white text-black mt-4 md:mt-0"
      >
        {card.ctaText}
      </motion.button> */}
    </motion.div>
  );
};
