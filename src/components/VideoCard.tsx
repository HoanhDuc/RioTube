import { motion } from "framer-motion";
import Image from "next/image";
import { ICardVideo } from "@/interfaces/video";
import { Avatar } from "@nextui-org/react";
import { formatSubscribersCount, formatViewCount } from "@/utils/format";

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
      className="cursor-pointer text-white relative"
    >
      <motion.div
        layoutId={`image-${card.title}-${id}`}
        // whileHover={{ scale: 1.05 }}
        // transition={{ duration: 0.2 }}
        className=" rounded-xl h-48 border border-primary overflow-hidden"
      >
        <Image
          width={600}
          height={400}
          src={card.src}
          alt={card.title}
          className="object-cover object-center h-48  rounded-xl"
          loading="lazy"
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
      <div className="flex flex-col gap-2 justify-between py-2">
        <motion.h3
          layoutId={`title-${card.title}-${id}`}
          className=" line-clamp-2"
        >
          {card.title} | {card.channelName}
        </motion.h3>
        <div className="flex gap-2 items-center justify-between">
          <div className="relative">
            <Avatar
              src={card.channelAvatar}
              className={card.isLiveStream ? "border-2 border-red-600" : ""}
            />
          </div>
          <div className="w-2/3">
            <p className="font-bold truncate text-sm">{card.channelName}</p>
            <p className="text-xs text-neutral-400 flex items-center gap-1">
              {formatSubscribersCount(card.channelSubscribers)}
            </p>
          </div>
          <motion.p
            layoutId={`description-${card.ctaText}-${id}`}
            className=" text-sm whitespace-nowrap flex gap-2 items-center w-1/3 justify-end"
          >
            {formatViewCount(card.ctaText)}
            <Image src="/eye.svg" alt="views" width={16} height={16} />
          </motion.p>
        </div>
      </div>
      {/* <motion.button
       &bull; <span className="">{card.publishedAt}</span>
        layoutId={`button-${card.title}-${id}`}
        className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-secondary hover:text-white text-black mt-4 md:mt-0"
      >
        {card.ctaText}
      </motion.button> */}
    </motion.div>
  );
};
