import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

interface SearchResult {
  _id: string;
  name: string;
  origin_name: string;
  thumb_url: string;
  poster_url: string;
  type: string;
  year: number;
  quality: string;
  lang: string;
  category: {
    id: string;
    name: string;
    slug: string;
  }[];
  time: string;
  slug: string;
}

interface SearchResponse {
  status: string;
  msg: string;
  data: {
    items: SearchResult[];
    params: {
      pagination: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
      };
    };
  };
}

async function searchMovies(query: string, page = 1): Promise<SearchResponse> {
  try {
    const res = await fetch(
      `https://phimapi.com/v1/api/tim-kiem?keyword=${encodeURIComponent(
        query
      )}&page=${page}`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed to fetch search results");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Search Error:", error);
    throw error;
  }
}

function SearchSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-gray-800 rounded-lg h-[400px]"></div>
      ))}
    </div>
  );
}

function NoResults() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h2 className="text-2xl font-bold mb-4">No results found</h2>
      <p className="text-gray-400">
        Try adjusting your search to find what you&apos;re looking for.
      </p>
    </div>
  );
}

const IMAGE_CDN_URL = "https://phimimg.com/";

function SearchResults({ results }: { results: SearchResult[] }) {
  if (!results?.length) return <NoResults />;

  const getImageUrl = (path: string | null | undefined) => {
    if (!path) return "/placeholder.jpg";
    if (path.startsWith("http")) return path;
    return `${IMAGE_CDN_URL}${path}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {results.map((item) => (
        <Link
          href={`/watch/${item.slug}`}
          key={item._id}
          className="bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300"
        >
          <div className="relative aspect-[2/3] w-full">
            <Image
              src={
                getImageUrl(item.thumb_url) ||
                getImageUrl(item.poster_url) ||
                "/placeholder.jpg"
              }
              alt={item.name}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 p-4">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {item.quality && (
                    <span className="bg-red-600 text-white px-2 py-1 text-xs rounded">
                      {item.quality}
                    </span>
                  )}
                  {item.year && (
                    <span className="bg-gray-700 text-white px-2 py-1 text-xs rounded">
                      {item.year}
                    </span>
                  )}
                  {item.lang && (
                    <span className="bg-gray-700 text-white px-2 py-1 text-xs rounded">
                      {item.lang}
                    </span>
                  )}
                  {item.time && (
                    <span className="bg-gray-700 text-white px-2 py-1 text-xs rounded">
                      {item.time}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white">{item.name}</h3>
                {item.origin_name && (
                  <p className="text-sm text-gray-300">{item.origin_name}</p>
                )}
                {item.category && item.category.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {item.category.map((cat) => (
                      <span
                        key={cat.id}
                        className="bg-gray-700/50 text-white px-2 py-1 text-xs rounded"
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

interface SearchParams {
  search_query?: string;
  page?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function ResultsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const query = params.search_query || "";
  const page = parseInt(params.page || "1");

  if (!query) {
    return (
      <div className="min-h-screen px-4 sm:px-6 md:px-8 lg:px-12 pt-16 sm:pt-20 md:pt-24">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8">
          Please enter a search term
        </h1>
      </div>
    );
  }

  try {
    const response = await searchMovies(query, page);

    return (
      <div className="min-h-screen px-4 sm:px-6 md:px-8 lg:px-12 pt-16 sm:pt-20 md:pt-24">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Search Results for &quot;{query}&quot;
          </h1>
          <p className="text-gray-400">
            Found {response?.data?.params?.pagination?.totalItems} results
          </p>
        </div>

        <Suspense fallback={<SearchSkeleton />}>
          <SearchResults results={response?.data?.items} />
        </Suspense>

        {/* Pagination */}
        {response?.data?.params?.pagination?.totalPages > 1 && (
          <div className="flex justify-center gap-2 sm:gap-4 mt-8 sm:mt-12 pb-8 sm:pb-12">
            {page > 1 && (
              <Link
                href={`/results?search_query=${query}&page=${page - 1}`}
                className="px-3 sm:px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 transition text-sm sm:text-base"
              >
                Previous
              </Link>
            )}
            <span className="px-3 sm:px-4 py-2 text-sm sm:text-base">
              Page {page} of {response?.data?.params?.pagination?.totalPages}
            </span>
            {page < response?.data?.params?.pagination?.totalPages && (
              <Link
                href={`/results?search_query=${query}&page=${page + 1}`}
                className="px-3 sm:px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 transition text-sm sm:text-base"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Page Error:", error);
    return (
      <div className="min-h-screen px-4 sm:px-6 md:px-8 lg:px-12 pt-16 sm:pt-20 md:pt-24">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8">
          Error loading search results
        </h1>
        <p className="text-gray-400">Please try again later.</p>
      </div>
    );
  }
}
