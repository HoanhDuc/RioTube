export interface VideoModalProps {
  active: ICardVideo;
  id: string;
  onClose: () => void;
  modalRef: React.RefObject<HTMLDivElement>;
}
export interface ICardVideo {
  title: string;
  description: string;
  src: string;
  ctaText: string;
  ctaLink: string;
  channelAvatar: string;
  channelName: string;
  channelSubscribers: string;
  publishedAt: string;
  videoId?: string;
  isLiveStream?: boolean;
  isSubscribed?: boolean;
  // content: () => JSX.Element;
  onClick?: () => void;
}
export interface IChannelCard {
  name: string;
  description: string;
  imageUrl: string;
  subscriberCount: string;
  isLiveStream: boolean;
  isSubscribed: boolean;
}
