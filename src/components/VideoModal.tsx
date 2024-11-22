import { Modal, ModalContent } from "@nextui-org/react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}

export function VideoModal({ isOpen, onClose, videoId }: VideoModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      classNames={{
        backdrop: "bg-black/75",
      }}
    >
      <ModalContent>
        <div className="aspect-video">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </ModalContent>
    </Modal>
  );
}
