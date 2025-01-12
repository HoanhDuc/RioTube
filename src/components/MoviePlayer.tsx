"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Artplayer from "artplayer";
import Hls from "hls.js";
import Image from "next/image";
import { colors } from "@/colors";
import { FormattedEpisode } from "@/types/movie";
import Link from "next/link";

interface MoviePlayerProps {
  videoUrl: string;
  title: string;
  episodes?: { [key: string]: FormattedEpisode[] };
  currentEpisode?: FormattedEpisode;
  onEpisodeChange?: (episode: FormattedEpisode) => void;
}

const MoviePlayer = ({
  videoUrl,
  title,
  episodes,
  currentEpisode,
  onEpisodeChange,
}: MoviePlayerProps) => {
  const artRef = useRef<HTMLDivElement>(null);
  const [isOpenEpisodes, setIsOpenEpisodes] = useState(false);
  const [isTitleVisible, setIsTitleVisible] = useState(true);
  const [activeServer, setActiveServer] = useState<string>("");

  useEffect(() => {
    if (episodes && Object.keys(episodes).length > 0) {
      const firstServer = Object.keys(episodes)[0];
      setActiveServer(firstServer);

      if (!currentEpisode && onEpisodeChange) {
        const firstEpisode = episodes[firstServer][0];
        if (firstEpisode) {
          onEpisodeChange(firstEpisode);
        }
      }
    }
  }, [episodes, currentEpisode, onEpisodeChange]);

  const openEpisodes = useCallback(() => {
    console.log("click", isOpenEpisodes);
    setIsOpenEpisodes(!isOpenEpisodes);
  }, [isOpenEpisodes]);
  useEffect(() => {
    if (!artRef.current) return;

    let hls: Hls | null = null;
    let art: Artplayer | null = null;

    const videoType = videoUrl.split(".").pop()?.toLowerCase() || "";
    const isHLS = videoUrl.includes(".m3u8");

    art = new Artplayer({
      container: artRef.current,
      url: videoUrl,
      type: isHLS ? "m3u8" : videoType,
      customType: {
        m3u8: function (video: HTMLVideoElement, url: string) {
          if (Hls.isSupported()) {
            hls = new Hls({
              enableWorker: true,
              lowLatencyMode: true,
              backBufferLength: 90,
            });
            hls.loadSource(url);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
              video.play().catch(() => {
                console.log("Failed to autoplay");
              });
            });
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
          }
        },
      },
      volume: 0.5,
      isLive: false,
      muted: false,
      autoplay: false,
      pip: false,
      autoSize: false,
      autoMini: false,
      screenshot: false,
      setting: false,
      hotkey: true,
      lock: true,
      playbackRate: true,
      fullscreen: true,
      subtitleOffset: false,
      miniProgressBar: false,
      airplay: true,
      theme: colors.secondary,
      icons: {
        play: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M8 5.14v14.52a.5.5 0 00.77.42l11.15-7.26a.5.5 0 000-.84L8.77 4.72a.5.5 0 00-.77.42z" 
          fill="currentColor"/>
        </svg>`,
        pause: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path fill="currentColor" d="M8 5h3v14H8V5zm5 0h3v14h-3V5z"/>
        </svg>`,
        volumeClose: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path fill="currentColor" d="M15 1.7L7.7 9H3v6h4.7l7.3 7.3V1.7z"/>
          <path fill="currentColor" d="M21.7 9.3l-1.4-1.4L18 10.2l-2.3-2.3-1.4 1.4 2.3 2.3-2.3 2.3 1.4 1.4 2.3-2.3 2.3 2.3 1.4-1.4-2.3-2.3z"/>
        </svg>`,
        fullscreen: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path fill="currentColor" d="M20 3H4c-.6 0-1 .4-1 1v16c0 .6.4 1 1 1h16c.6 0 1-.4 1-1V4c0-.6-.4-1-1-1zm-1 16H5V5h14v14z"/>
          <path fill="currentColor" d="M8 11h8v2H8z"/>
        </svg>`,
        fullscreenWeb: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path fill="currentColor" d="M20 3H4c-.6 0-1 .4-1 1v16c0 .6.4 1 1 1h16c.6 0 1-.4 1-1V4c0-.6-.4-1-1-1zm-1 16H5V5h14v14z"/>
          <path fill="currentColor" d="M8 11h8v2H8z"/>
        </svg>`,
        state: `<img src="/logo.svg" width="100" height="100" style="background-color: #000; border-radius: 50%; padding: 10px;" />`,
      },
      controls: [
        {
          position: "right",
          html: `<span class="text-white text-lg" style="position: absolute; left: 50%; transform: translateX(-50%); font-weight: bold;">${title}</span>`,
        },
        {
          position: "right",
          html: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 21 21">
            <g fill="none" fill-rule="evenodd" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" transform="translate(1 4)">
              <path d="m13.5 12.5v-6c0-1.1045695-.8954305-2-2-2h-9c-1.1045695 0-2 .8954305-2 2v6c0 1.1045695.8954305 2 2 2h9c1.1045695 0 2-.8954305 2-2z"/>
              <path d="m15.5 12.5v-6.99481259c0-1.65685425-1.3431458-3-3-3-.0017276 0-.0034553 0-.0051829 0l-8.9948171.01554432"/>
              <path d="m17.5 10.5v-5.99308345c0-2.209139-1.790861-4-4-4-.0023035 0-.004607 0-.0069106 0l-7.9930894.01381519"/>
            </g>
          </svg>`,
          tooltip: "Episodes",
          click: function () {
            document.querySelector(".episode-list")?.classList.toggle("w-80");
          },
        },
      ],
      layers: [],
      highlight: [],
      playsInline: true,
      mutex: true,
      backdrop: true,
      aspectRatio: true,
      plugins: [],
      fullscreenWeb: false,
    });

    return () => {
      if (art && art.destroy) {
        art.destroy(false);
      }
      if (hls) {
        hls.destroy();
      }
    };
  }, [videoUrl, openEpisodes, title]);

  useEffect(() => {
    const art = artRef.current?.querySelector(".artplayer-app") as {
      player: Artplayer;
    } | null;
    if (art?.player) {
      art.player.switchUrl(videoUrl);
      document.querySelector(".episode-list")?.classList.toggle("w-80");
    }
  }, [videoUrl]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleMouseMove = () => {
      setIsTitleVisible(true);
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        setIsTitleVisible(false);
      }, 3000);
    };

    document.addEventListener("mousemove", handleMouseMove);

    handleMouseMove();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="relative">
      <div ref={artRef} className="w-screen h-screen" />
      <div
        className={`z-10 absolute top-0 left-0 right-0 p-5 bg-gradient-to-b from-black/70 to-transparent transition-opacity duration-300 ${
          isTitleVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center">
          <Link href="/" className="text-white hover:text-secondary mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="h-[50px] w-[2px] bg-secondary" />
          <h1 className="text-2xl font-bold ml-3">{title}</h1>
        </div>
      </div>

      <div
        className={`episode-list w-0 overflow-hidden absolute bottom-16 right-0 top-16 bg-primary overflow-y-auto z-50 transition-all duration-300`}
      >
        {episodes && (
          <div className="flex flex-col h-full">
            <div className="flex border-b border-gray-700">
              {Object.keys(episodes).map((serverName) => (
                <button
                  key={serverName}
                  onClick={() => setActiveServer(serverName)}
                  className={`whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors
                    ${
                      activeServer === serverName
                        ? "text-secondary border-b-2 border-secondary"
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                >
                  {serverName}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto">
              {episodes[activeServer]?.map((episode) => (
                <button
                  key={episode.id}
                  onClick={() => onEpisodeChange?.(episode)}
                  className={`w-full p-4 flex items-center flex-nowrap gap-4 transition-colors
                    ${
                      currentEpisode?.id === episode.id
                        ? "bg-secondary"
                        : "hover:text-secondary"
                    }`}
                >
                  {episode.thumbnail && (
                    <Image
                      src={episode.thumbnail}
                      alt={episode.title}
                      className="w-24 h-16 object-cover rounded"
                      width={100}
                      height={100}
                    />
                  )}
                  <div className="flex-1 text-left whitespace-nowrap">
                    <p className="font-medium">{episode.title}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoviePlayer;
