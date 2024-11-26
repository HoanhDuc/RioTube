"use client";
import { getChannelInfo, getVideoInfo, getVideoComments } from "@/apis/youtube";
import { ICardVideo } from "@/interfaces/video";
import { CommentVideo } from "@/interfaces/youtube";
import { formatViewCount } from "@/utils/format";
import { formatSubscribersCount } from "@/utils/format";
import { Avatar, Skeleton } from "@nextui-org/react";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Suspense } from "react";

export default function WatchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WatchPageContent />
    </Suspense>
  );
}

function VideoDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-2 lg:gap-3">
      <Skeleton className="h-[250px] md:h-[400px] lg:h-[500px] rounded-lg mb-3 md:mb-5" />
      <Skeleton className="h-8 w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4 rounded-lg" />
      <div className="flex gap-2 items-center mt-3">
        <div className="w-1/3">
          <Skeleton className="w-12 h-12 rounded-full" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-40 rounded-lg" />
          <Skeleton className="h-3 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function CommentSkeleton() {
  return (
    <div className="border-b border-primary py-3">
      <div className="flex gap-2 items-start mb-2">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="w-full">
          <div className="flex justify-between items-center mb-2">
            <Skeleton className="h-4 w-1/3 rounded-lg" />
            <Skeleton className="h-3 w-1/4 rounded-lg" />
          </div>
          <Skeleton className="h-4 w-full rounded-lg mb-2" />
          <Skeleton className="h-4 w-3/4 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function WatchPageContent() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get("v");
  const [videoDetails, setVideoDetails] = useState<ICardVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<CommentVideo[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [currentYTLink, setCurrentYTLink] = useState<string>(
    `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&controls=1&modestbranding=1&playsinline=1&rel=0&enablejsapi=1`
  );

  function CommentItem({
    comment,
    channelAvatar,
  }: {
    comment: CommentVideo;
    channelAvatar?: string;
  }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const MAX_COMMENT_LENGTH = 200;
    const videoId = useSearchParams().get("v");
    const commentSnippet = comment.snippet.topLevelComment.snippet;
    const commentText = commentSnippet.textDisplay;
    const isLongComment = commentText.length > MAX_COMMENT_LENGTH;
    const likes = commentSnippet.likeCount || 0;
    const replyCount = comment.snippet.totalReplyCount || 0;

    const processCommentText = (text: string) => {
      const timestampRegex = /(\d+:(?:\d{2})+)/g;
      return text.replace(timestampRegex, (match) => {
        return `<a href="#" class="text-green-500 hover:underline timestamp-link" data-timestamp="${match}">${match}</a>`;
      });
    };

    return (
      <div className="border-b border-primary py-3">
        <div className="flex gap-2 items-start mb-2">
          <div>
            <Avatar
              src={commentSnippet.authorProfileImageUrl || channelAvatar}
            />
          </div>
          <div className="w-full">
            <div className="flex justify-between items-center">
              <p className="text-white text-sm lg:text-base font-bold">
                {commentSnippet.authorDisplayName}
              </p>
              <p className="text-neutral-400 text-xs">
                {formatDistanceToNow(new Date(commentSnippet.publishedAt))} ago
              </p>
            </div>
            <p
              className="text-white mt-1 text-sm"
              dangerouslySetInnerHTML={{
                __html:
                  isLongComment && !isExpanded
                    ? processCommentText(
                        commentText.slice(0, MAX_COMMENT_LENGTH)
                      ) + "..."
                    : processCommentText(commentText),
              }}
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.classList.contains("timestamp-link")) {
                  e.preventDefault();
                  const timestamp = target.getAttribute("data-timestamp");
                  if (timestamp) {
                    const timeToSeconds = (time: string) => {
                      const parts = time.split(":").map(Number);
                      return parts.length === 3
                        ? parts[0] * 3600 + parts[1] * 60 + parts[2]
                        : parts[0] * 60 + parts[1];
                    };

                    const seconds = timeToSeconds(timestamp);
                    setCurrentYTLink(
                      `https://www.youtube.com/embed/${videoId}?autoplay=1&start=${seconds}`
                    );
                  }
                }
              }}
            />

            <div className="flex items-center gap-4 mt-2 text-neutral-400 text-xs">
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
                <span className="mt-1">{likes.toLocaleString()}</span>
              </div>

              {replyCount > 0 && (
                <button
                  onClick={() => setShowReplies(!showReplies)}
                  className="flex items-center gap-1 text-secondary hover:underline"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="16 17 21 12 16 7" />
                    <path d="M3 12h13a4 4 0 0 1 0 8h-4" />
                  </svg>
                  {replyCount} {replyCount === 1 ? "Reply" : "Replies"}
                </button>
              )}
            </div>

            {isLongComment && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-secondary text-sm mt-1 hover:underline"
              >
                {isExpanded ? "Show Less" : "View More"}
              </button>
            )}
          </div>
        </div>

        {showReplies && (
          <div className="ml-10 mt-2 text-neutral-400">
            <p>Developing...</p>
          </div>
        )}
      </div>
    );
  }

  const fetchVideoInfo = async () => {
    setLoading(true);
    if (!videoId) return;

    try {
      const videoDetails = await getVideoInfo({
        id: videoId,
      });
      if (!videoDetails.items.length) return;

      const channelData = await getChannelInfo({
        id: videoDetails.items[0].snippet.channelId,
        type: "channel",
      });

      const commentThreads = await getVideoComments({
        videoId: videoId,
        maxResults: 20,
      });

      const videoData = {
        title: videoDetails.items[0].snippet.title,
        description: videoDetails.items[0].snippet.description,
        src: videoDetails.items[0].snippet.thumbnails.high.url,
        ctaText: videoDetails.items[0].statistics?.viewCount || "0",
        channelAvatar: channelData.items[0]?.snippet.thumbnails.high.url,
        channelName: videoDetails.items[0].snippet.channelTitle,
        ctaLink: "1000",
        channelSubscribers:
          channelData.items[0]?.statistics.subscriberCount || "0",
        publishedAt: formatDistanceToNow(
          new Date(videoDetails.items[0].snippet.publishedAt)
        ),
        isLiveStream:
          videoDetails.items[0].snippet.liveBroadcastContent === "live",
        // isSubscribed: subscribedChannels.includes(
        //   videoDetails.items[0].snippet.channelId
        // ),
      };

      setVideoDetails(videoData);
      setComments(commentThreads.items);
      setNextPageToken(commentThreads.nextPageToken || null);

      // Update the current video ID state
    } catch (error) {
      console.error("Error fetching video details:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreComments = async () => {
    if (!videoId || !nextPageToken) return;

    setCommentsLoading(true);
    try {
      const moreComments = await getVideoComments({
        videoId: videoId,
        maxResults: 20,
        pageToken: nextPageToken,
      });

      setComments((prevComments) => [...prevComments, ...moreComments.items]);
      setNextPageToken(moreComments.nextPageToken || null);
    } catch (error) {
      console.error("Error loading more comments:", error);
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideoInfo();
  }, [videoId]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentYTLink]);

  return (
    <AnimatePresence>
      <motion.div
        className="container mx-auto flex justify-center items-start p-5 bg-background"
        initial={{ y: "-50px" }}
        animate={{ y: 0 }}
        exit={{ y: "-50px" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="w-full h-full lg:flex gap-8 text-white space-y-5 lg:space-y-0">
          <div className="lg:w-2/3">
            {loading ? (
              <VideoDetailsSkeleton />
            ) : (
              <div className="flex flex-col gap-2 lg:gap-3">
                <iframe
                  className="w-full h-[250px] md:h-[400px] lg:h-[500px] border border-primary rounded-lg mb-3 md:mb-5"
                  src={currentYTLink}
                  width="100%"
                  height="100%"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />

                <motion.h3
                  layoutId={`title-${videoId}`}
                  className="line-clamp-2 text-lg md:text-2xl font-bold"
                >
                  {videoDetails?.title} | {videoDetails?.channelName}
                </motion.h3>
                <motion.p
                  layoutId={`description-${videoId}`}
                  className="text-neutral-400 text-sm whitespace-nowrap flex gap-2 items-center"
                >
                  {formatViewCount(videoDetails?.ctaText || "0")} Views -
                  Published on {videoDetails?.publishedAt} ago
                </motion.p>
                <div className="flex gap-2 items-center mb-5">
                  <div>
                    <Avatar src={videoDetails?.channelAvatar} />
                  </div>
                  <div className="w-2/3">
                    <p className="font-bold truncate">
                      {videoDetails?.channelName}
                    </p>
                    <p className="text-xs text-neutral-400 flex items-center gap-1">
                      {formatSubscribersCount(
                        videoDetails?.channelSubscribers || "0"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-5 border border-primary rounded-lg mt-5">
              <p className="text-secondary text-xl lg:text-2xl font-bold">
                Comments
              </p>
              <div className="my-2 bg-primary h-[1px]" />
              <div>
                {!loading
                  ? comments.map((comment, index) => (
                      <CommentItem
                        key={`${comment.id}-${index}`}
                        comment={comment}
                        channelAvatar={videoDetails?.channelAvatar}
                      />
                    ))
                  : Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <CommentSkeleton key={`skeleton-${index}`} />
                      ))}

                {!loading && nextPageToken && (
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={loadMoreComments}
                      disabled={commentsLoading}
                      className="bg-secondary text-white px-4 py-2 rounded hover:bg-opacity-80 disabled:opacity-50"
                    >
                      {commentsLoading ? "Loading..." : "Load More Comments"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="lg:w-1/3 p-5 border border-primary rounded-lg">
            <p className="text-secondary text-xl lg:text-2xl font-bold border-b border-primary pb-2">
              Related Videos
            </p>
            <div className="mt-2">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <div key={`skeleton-${index}`}>
                    <Skeleton className="w-full h-24 rounded-lg mb-3" />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
