import { motion } from "framer-motion";
import Image from "next/image";
import { VideoCardProps } from "@/interfaces/video";
import { Avatar } from "@nextui-org/react";
import { formatSubscribersCount } from "@/utils/format";

export const VideoCard = ({ card, id, onCardClick }: VideoCardProps) => {
  return (
    <motion.div
      layoutId={`card-${card.title}-${id}`}
      onClick={() => onCardClick && onCardClick(card)}
      className="flex flex-col justify-between gap-5 p-4 rounded-xl cursor-pointer text-white bg-primary hover:border  hover:border-secondary"
    >
      <div className="">
        <motion.div layoutId={`image-${card.title}-${id}`} className="mb-3">
          <Image
            width={600}
            height={400}
            src={card.src}
            alt={card.title}
            className="object-cover object-center rounded-xl border-2 border-black"
          />
        </motion.div>
        <motion.h3
          layoutId={`title-${card.title}-${id}`}
          className=" line-clamp-2"
        >
          {card.title}
        </motion.h3>
      </div>
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
      {/* <motion.button
        layoutId={`button-${card.title}-${id}`}
        className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-secondary hover:text-white text-black mt-4 md:mt-0"
      >
        {card.ctaText}
      </motion.button> */}
    </motion.div>
  );
};
