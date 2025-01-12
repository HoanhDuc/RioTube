"use client";

import VideoPlayer from "@/components/MoviePlayer";
import { PageTransition } from "@/components/PageTransition";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MovieResponse } from "@/types/movie";
import { FormattedEpisode } from "@/types/movie";

export default function WatchPage() {
  const { id } = useParams();
  const [currentEpisode, setCurrentEpisode] = useState<FormattedEpisode | null>(
    null
  );
  const [episodes, setEpisodes] = useState<{
    [key: string]: FormattedEpisode[];
  }>({});
  const [title, setTitle] = useState("");

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const response = await fetch(`https://phimapi.com/phim/${id}`);
        const data: MovieResponse = await response.json();

        const formattedEpisodes = data.episodes.reduce(
          (acc, server, serverIndex) => {
            acc[server.server_name] = server.server_data.map((episode) => ({
              id: `${serverIndex}-${episode.slug}`,
              title: `${episode.name}`,
              url: episode.link_m3u8 || episode.link_embed,
              thumbnail: data.movie.thumb_url || data.movie.poster_url,
            }));
            return acc;
          },
          {} as { [key: string]: FormattedEpisode[] }
        );

        setTitle(data.movie.name);
        setEpisodes(formattedEpisodes);
        setCurrentEpisode(Object.values(formattedEpisodes)[0]?.[0] || null);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    if (id) {
      fetchMovieData();
    }
  }, [id]);

  return (
    <PageTransition>
      <VideoPlayer
        videoUrl={currentEpisode?.url || ""}
        title={title}
        episodes={episodes}
        currentEpisode={currentEpisode || undefined}
        onEpisodeChange={setCurrentEpisode}
      />
    </PageTransition>
  );
}
