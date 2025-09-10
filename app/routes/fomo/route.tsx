import type { MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { formatDistanceToNow } from "date-fns";
import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";
import { useEffect, useState } from "react";
import useSWRInfinite from "swr/infinite";
import type { FomoPostsResponse } from "~/types";
import { useDebounce } from "~/utils";
import Loading from "../loading";

export const meta: MetaFunction = () => {
  return [
    { title: "Fomo Feed - Murzfeed Lite" },
    { name: "description", content: "Fomo posts w/ HN style" },
  ];
};

export const loader = async ({ request }: { request: Request }) => {
  // initial data for first page
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  const response = await fetch(`${baseUrl}/api/fomo/posts?page=1&sortBy=recent`);
  return response.json();
};

const sortOptions = [
  { value: "recent", label: "Recent" },
  { value: "trending", label: "Trending" },
];

const fetcher = async (url: string) => {
  const response = await fetch(url);
  return response.json();
};

export default function Fomo() {
  const initialPosts = useLoaderData<FomoPostsResponse>();
  const [params, setParams] = useQueryStates({
    sortBy: parseAsStringEnum(sortOptions.map((o) => o.value)).withDefault("recent"),
    search: parseAsString.withDefault(""),
  });
  const [searchTerm, setSearchTerm] = useState(params.search);

  const getKey = (index: number, _prev: FomoPostsResponse | null) => {
    const page = index + 1;
    if (params.search) {
      return `/api/fomo/search?query=${encodeURIComponent(params.search)}&page=${page}`;
    }
    return `/api/fomo/posts?page=${page}&sortBy=${params.sortBy}`;
  };

  const {
    data: newPosts,
    isLoading,
    isValidating,
    setSize,
    size,
  } = useSWRInfinite(getKey, fetcher, {
    fallbackData: [initialPosts],
  });

  const posts = newPosts ? newPosts.flatMap(response => response.data) : initialPosts.data;

  const contentExcerpt = (content: string) => {
    if (!content) return "";
    const trimmed = content.split(" ").slice(0, 20).join(" ");
    const text = `${trimmed.length < 100 ? trimmed : trimmed.substring(0, 100)}`;
    return trimmed.length >= content.length ? text : `${text}...`;
  };

  const debouncedSearch = useDebounce(searchTerm, searchTerm === "" ? 0 : 500);
  useEffect(() => {
    if (debouncedSearch !== params.search) {
      setParams({ search: debouncedSearch, sortBy: "recent" });
    }
  }, [params.search, debouncedSearch, setParams]);

  return (
    <div className="mb-8">
      <div className="my-2 flex items-center gap-2 justify-between text-xs">
        <div>
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading || isValidating}
            value={searchTerm}
            className="px-2 border-2 border-slate-300 rounded mr-2"
            type="search"
            placeholder="Search fomo posts..."
          />
        </div>
        <div className="flex gap-2">
          {sortOptions.map((option) => (
            <Link
              key={option.value}
              to={`/fomo?sortBy=${option.value}`}
              className={params.sortBy === option.value ? "font-bold underline" : ""}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </div>

      {params.search.length > 0 ? (
        <div>
          <span>Showing search results for "{params.search}"</span>{" "}
          <button
            type="button"
            className="bg-slate-200 rounded px-2"
            onClick={() => setSearchTerm("")}
          >
            Reset
          </button>
        </div>
      ) : null}

      {posts.map((post) => {
        const postData = post.inner;
        if (!postData || postData.deleted || postData.banned) return null;

        return (
          <Link to={`/fomo/${postData.activityId}`} key={postData.activityId}>
            <div
              key={postData.activityId}
              className="my-2 bg-slate-50 p-2 border-[1px] border-slate-300 rounded-md"
            >
              <div className="flex flex-row gap-2 items-center justify-between">
                <div className="w-full">
                  {postData.title && (
                    <p className="font-bold">{postData.title}</p>
                  )}
                  {postData.content && (
                    <p className="mt-2">{contentExcerpt(postData.content)}</p>
                  )}
                  <div className="mt-4 flex flex-row justify-between items-center">
                    <div className="flex items-center gap-2">
                      {postData.user && (
                        <span className="text-blue-700 text-xs">
                          @{postData.user.username} at {postData.user.companyName}
                        </span>
                      )}
                      {postData.channel && (
                        <span className="text-green-700 text-xs bg-green-100 px-1 rounded">
                          {postData.channel.name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-blue-700">
                        👍 {postData.numberOfLikes || 0} 👎 {postData.numberOfDislikes || 0}
                      </span>
                      <span className="text-blue-700">
                        💬 {postData.numberOfComments || 0}
                      </span>
                      {postData.creationTime && (
                        <span className="text-xs">
                          {formatDistanceToNow(new Date(postData.creationTime), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}

      <div className="mt-4">
        {params.search.length < 1 ? (
          <button
            type="button"
            className="w-full bg-slate-200 py-2"
            onClick={() => {
              setSize(size + 1);
            }}
          >
            {isLoading || isValidating ? <Loading /> : "Load more"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
