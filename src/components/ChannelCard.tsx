import { formatSubscribersCount } from "@/utils/format";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

interface ChannelCardProps {
  card: {
    name: string;
    description?: string;
    imageUrl?: string;
    subscriberCount?: string;
    isLiveStream?: boolean;
  };
}

const ChannelCard: React.FC<ChannelCardProps> = ({ card }) => {
  return (
    <div className="bg-primary text-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between space-x-3">
        <div className="flex items-center gap-3">
          {card.imageUrl && (
            <div className="relative rounded-full flex items-end justify-center">
              <div className="w-20 h-20">
                <Image
                  src={card.imageUrl}
                  alt={`${card.name} channel`}
                  className={`w-20 h-20 rounded-full object-cover ${
                    card.isLiveStream ? "border-2 border-red-500" : ""
                  }`}
                  width={64}
                  height={64}
                />
              </div>
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
                  className="absolute bg-red-600 text-white px-1.5 rounded-md text-xs font-medium flex items-center gap-1"
                >
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  LIVE
                </motion.div>
              )}
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold line-clamp-2">{card.name}</h3>
            {card.subscriberCount && (
              <p className="text-xs">
                {formatSubscribersCount(card.subscriberCount)}
              </p>
            )}
          </div>
        </div>
        <motion.button
          layoutId={`button-${card.name}`}
          className="px-4 py-2 text-sm rounded-full font-bold bg-white hover:bg-secondary hover:text-white text-primary mt-4 md:mt-0 flex items-center gap-2"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          Subscribe
        </motion.button>
      </div>
      {card.description && (
        <p className="text-xs line-clamp-2 text-gray-400 mt-3">
          {card.description}
        </p>
      )}
    </div>
  );
};

export default ChannelCard;
