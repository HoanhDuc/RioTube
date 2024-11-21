export interface VideoCardProps {
  card: ICardVideo;
  id: string;
  onCardClick?: (card: ICardVideo) => void;
}

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
  content: () => JSX.Element;
}
