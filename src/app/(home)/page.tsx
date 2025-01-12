"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

// Types for our movie data
interface Movie {
  id: string;
  name: string;
  origin_name: string;
  thumb_url: string;
  poster_url: string;
  description: string;
  slug: string;
}

interface MovieResponse {
  items: Movie[];
  total: number;
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
}

interface ApiMovieItem {
  _id: string;
  name: string;
  origin_name: string;
  thumb_url: string;
  poster_url: string;
  description?: string;
  slug: string;
}

// Fetch functions
async function getLatestMovies(page = 1) {
  const res = await fetch(
    `https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=${page}`
  );
  return res.json() as Promise<MovieResponse>;
}

async function getTVShows(page = 1) {
  try {
    const res = await fetch(
      `https://phimapi.com/v1/api/danh-sach/tv-shows?page=${page}&limit=10`,
      { next: { revalidate: 0 } }
    );
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const { data } = await res.json();
    const transformedData: MovieResponse = {
      items: data?.items?.map((item: ApiMovieItem) => ({
        id: item._id,
        name: item.name,
        origin_name: item.origin_name,
        thumb_url: `${data.APP_DOMAIN_CDN_IMAGE}/${item.thumb_url}`,
        poster_url: `${data.APP_DOMAIN_CDN_IMAGE}/${item.poster_url}`,
        description: item.description || "",
        slug: item.slug,
      })),
      total: data.params.pagination.totalItems,
      pagination: {
        totalItems: data.params.pagination.totalItems,
        totalPages: data.params.pagination.totalPages,
        currentPage: data.params.pagination.currentPage,
      },
    };

    return transformedData;
  } catch (error) {
    console.error("Error fetching TV shows:", error);
    return {
      items: [],
      total: 0,
      pagination: { totalItems: 0, totalPages: 0, currentPage: 1 },
    };
  }
}

async function getTopRated(page = 1) {
  try {
    const res = await fetch(
      `https://phimapi.com/v1/api/danh-sach/phim-le?page=${page}&limit=10`,
      { next: { revalidate: 0 } }
    );
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const { data } = await res.json();
    const transformedData: MovieResponse = {
      items: data?.items?.map((item: ApiMovieItem) => ({
        id: item._id,
        name: item.name,
        origin_name: item.origin_name,
        thumb_url: `${data.APP_DOMAIN_CDN_IMAGE}/${item.thumb_url}`,
        poster_url: `${data.APP_DOMAIN_CDN_IMAGE}/${item.poster_url}`,
        description: item.description || "",
        slug: item.slug,
      })),
      total: data.params.pagination.totalItems,
      pagination: {
        totalItems: data.params.pagination.totalItems,
        totalPages: data.params.pagination.totalPages,
        currentPage: data.params.pagination.currentPage,
      },
    };

    return transformedData;
  } catch (error) {
    console.error("Error fetching top rated movies:", error);
    return {
      items: [],
      total: 0,
      pagination: { totalItems: 0, totalPages: 0, currentPage: 1 },
    };
  }
}

async function getAnimated(page = 1) {
  try {
    const res = await fetch(
      `https://phimapi.com/v1/api/danh-sach/hoat-hinh?page=${page}&limit=10`,
      { next: { revalidate: 0 } }
    );
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const { data } = await res.json();
    const transformedData: MovieResponse = {
      items: data?.items?.map((item: ApiMovieItem) => ({
        id: item._id,
        name: item.name,
        origin_name: item.origin_name,
        thumb_url: `${data.APP_DOMAIN_CDN_IMAGE}/${item.thumb_url}`,
        poster_url: `${data.APP_DOMAIN_CDN_IMAGE}/${item.poster_url}`,
        description: item.description || "",
        slug: item.slug,
      })),
      total: data.params.pagination.totalItems,
      pagination: {
        totalItems: data.params.pagination.totalItems,
        totalPages: data.params.pagination.totalPages,
        currentPage: data.params.pagination.currentPage,
      },
    };

    return transformedData;
  } catch (error) {
    console.error("Error fetching animated movies:", error);
    return {
      items: [],
      total: 0,
      pagination: { totalItems: 0, totalPages: 0, currentPage: 1 },
    };
  }
}

// SVG Icons as components
const PlayIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
  >
    <path
      fillRule="evenodd"
      d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
      clipRule="evenodd"
    />
  </svg>
);

const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
  >
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
      clipRule="evenodd"
    />
  </svg>
);

// Add new ChevronIcon components
const ChevronLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
  >
    <path
      fillRule="evenodd"
      d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
      clipRule="evenodd"
    />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
  >
    <path
      fillRule="evenodd"
      d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
      clipRule="evenodd"
    />
  </svg>
);

// Enhanced MovieRow with hover effect
function MovieRow({ title, movies }: { title: string; movies: Movie[] }) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 800;
      const container = scrollContainerRef.current;
      const newScrollPosition =
        container.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);

      container.style.scrollBehavior = "smooth";
      container.scrollLeft = newScrollPosition;
    }
  };

  return (
    <div className="mb-4 md:mb-8 group">
      <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 text-white px-4 md:px-0">
        {title}
      </h2>
      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="absolute -left-5 top-1/2 -translate-y-1/2 z-40 bg-primary p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
        >
          <ChevronLeftIcon />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex gap-1 md:gap-2 overflow-x-auto pb-4 px-4 md:px-0 no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {movies?.map((movie, index) => (
            <Link href={`/watch/${movie.slug}`} key={index}>
              <div className="flex-none relative group/item">
                <div className="w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] rounded-md group-hover/item:z-10 overflow-hidden cursor-pointer">
                  <Image
                    src={movie.thumb_url}
                    alt={movie.name}
                    width={280}
                    height={157}
                    className="group-hover/item:scale-110 object-cover transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover/item:bg-opacity-50 transition-all duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                    <p className="text-white font-bold text-sm md:text-base">
                      {movie.name}
                    </p>
                    <p className="text-gray-300 text-xs md:text-sm">
                      {movie.origin_name}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute -right-5 top-1/2 -translate-y-1/2 z-40 bg-primary p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
}

function Page() {
  const [movieData, setMovieData] = React.useState<{
    latestMovies?: MovieResponse;
    tvShows?: MovieResponse;
    topRated?: MovieResponse;
    animated?: MovieResponse;
  }>({});

  React.useEffect(() => {
    async function fetchData() {
      try {
        const [latestMovies, tvShows, topRated, animated] = await Promise.all([
          getLatestMovies(),
          getTVShows(),
          getTopRated(),
          getAnimated(),
        ]);
        setMovieData({ latestMovies, tvShows, topRated, animated });
      } catch (error) {
        console.error("Error loading page:", error);
      }
    }
    fetchData();
  }, []);

  if (!movieData.latestMovies?.items?.length) {
    return <div className="text-white">Loading...</div>;
  }

  const featuredMovie = movieData.latestMovies.items[0];

  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[95vh]">
        <Image
          src={featuredMovie.poster_url || featuredMovie.thumb_url}
          alt={featuredMovie.name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute bottom-[20%] left-4 md:left-12 max-w-xl p-4 md:p-0">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-2 md:mb-6">
            {featuredMovie.name}
          </h1>
          <p className="text-white text-sm md:text-xl mb-4 md:mb-6 line-clamp-3 md:line-clamp-none">
            {featuredMovie.description}
          </p>
          <div className="flex gap-2 md:gap-4">
            <button className="flex items-center gap-1 md:gap-2 px-4 md:px-8 py-2 md:py-3 bg-white text-black rounded-md hover:bg-opacity-80 transition text-sm md:text-base">
              <PlayIcon />
              Play
            </button>
            <button className="flex items-center gap-1 md:gap-2 px-4 md:px-8 py-2 md:py-3 bg-gray-500/50 text-white rounded-md hover:bg-gray-500/70 transition text-sm md:text-base">
              <InfoIcon />
              More Info
            </button>
          </div>
        </div>
      </div>

      {/* Content Rows */}
      <div className="relative z-10 px-0 md:px-12 -mt-16 md:-mt-32">
        <MovieRow title="Trending Now" movies={movieData.latestMovies.items} />
        <MovieRow title="TV Shows" movies={movieData?.tvShows?.items ?? []} />
        <MovieRow title="Top Rated" movies={movieData?.topRated?.items ?? []} />
        <MovieRow title="Animated" movies={movieData?.animated?.items ?? []} />
      </div>
    </main>
  );
}

export default Page;
