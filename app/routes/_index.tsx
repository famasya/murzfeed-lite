import type { MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { formatDistanceToNow } from "date-fns";
import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";
import { useEffect, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { firebaseFetcher, useDebounce } from "~/utils";
import Loading from "./loading";
import type { Posts } from "./posts";
import { defaultQuery, searchQuery } from "./query";

export const meta: MetaFunction = () => {
  return [
    { title: "Murzfeed Lite" },
    { name: "description", content: "Murzfeed w/ HN style" },
  ];
};

export const loader = async () => {
  // initial data
  const response = await firebaseFetcher<Posts>(defaultQuery);
  return response;
};

export default function Index() {
  const initialPosts = useLoaderData<typeof loader>();
  const [params, setParams] = useQueryStates({
    sortBy: parseAsStringEnum([
      "newest",
      "newest_all",
      "trending",
      "last_activity",
    ]).withDefault("newest"),
    search: parseAsString.withDefault(""),
  });
  const [searchTerm, setSearchTerm] = useState(params.search);

  const getKey = (index: number, prev: Posts | null) => {
    if (index === 0) return ["first", params.sortBy, params.search]; // first page
    return [
      prev?.[prev?.length - 1].document?.fields.createdAt.timestampValue,
      params.sortBy,
      params.search,
    ];
  };
  const {
    data: newPosts,
    isLoading,
    isValidating,
    setSize,
    size,
  } = useSWRInfinite(getKey, async ([ts, sortBy, search]) => {
    if (ts === "first" && sortBy === "newest" && search === "")
      return initialPosts; // fallback

    // handle non-search
    // biome-ignore lint/suspicious/noExplicitAny: initial value
    let modifiedQuery: any;
    if (!search || search === "") {
      modifiedQuery = structuredClone(defaultQuery); // clone
      if (sortBy === "last_activity" || sortBy === "newest_all") {
        modifiedQuery.structuredQuery.where.compositeFilter.filters[0] =
          undefined; // remove category filter
      }
      let orderBy = "createdAt";
      if (sortBy === "last_activity" || sortBy === "newest_all") {
        orderBy = "latestCommentCreatedAt";
      }

      modifiedQuery.structuredQuery.orderBy[0].field.fieldPath = orderBy;
      modifiedQuery = {
        structuredQuery: {
          ...modifiedQuery.structuredQuery,
          startAt: {
            values: [
              {
                timestampValue: ts === "first" ? new Date().toISOString() : ts,
              },
            ],
          },
        },
      };
    } else {
      modifiedQuery = searchQuery(search);
    }
    // reorder results
    const results = (await firebaseFetcher<Posts>(modifiedQuery))
      .filter((doc) => doc.document)
      .sort((a, b) => {
        if (!a.document || !b.document) return 0;
        return (
          new Date(b.document.fields.createdAt.timestampValue).getTime() -
          new Date(a.document.fields.createdAt.timestampValue).getTime()
        );
      });
    return results;
  });
  const posts = newPosts ? newPosts.flat() : [];

  const contentExcerpt = (content: string) => {
    const trimmed = content.split(" ").slice(0, 20).join(" ");
    const text = `${trimmed.length < 100 ? trimmed : trimmed.substring(0, 100)}`;
    return trimmed.length >= content.length ? text : `${text}...`;
  };

  const debouncedSearch = useDebounce(searchTerm, searchTerm === "" ? 0 : 500);
  useEffect(() => {
    if (debouncedSearch !== params.search) {
      setParams({ search: debouncedSearch, sortBy: "newest" });
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
            placeholder="Search (press enter)"
          />
        </div>
        <div>
          <select
            value={params.sortBy}
            className="px-2 border-2 rounded"
            disabled={params.search.length > 0 || isLoading || isValidating}
            onChange={(e) => {
              setParams({
                sortBy: e.target.value as
                  | "newest"
                  | "trending"
                  | "last_activity",
              });
            }}
          >
            <option value="newest">Newest</option>
            <option value="newest_all">Newest All Category</option>
            <option value="trending">Trending</option>
            <option value="last_activity">Last Activity</option>
          </select>
        </div>
      </div>

      {posts.map(({ document: post }) => {
        if (!post) return;
        const fields = post.fields;
        const friendlyUrl = fields.title.stringValue
          .replace(/[^a-zA-Z0-9]/g, "-")
          .toLowerCase();
        return (
          <div
            key={post.name}
            className="my-2 bg-slate-50 p-2 border-[1px] border-slate-300 rounded-md"
          >
            <Link
              rel="prefetch"
              to={`/post/${friendlyUrl}-${fields.postId.stringValue}`}
              className="flex flex-row gap-2 items-center justify-between"
            >
              <div className="w-full">
                <p className="font-bold">{fields.title.stringValue}</p>
                <p className="mt-2">
                  {contentExcerpt(fields.content.stringValue)}
                </p>
                <div className="mt-4 flex flex-row justify-between items-center">
                  <span className="text-blue-700 text-xs">
                    [
                    {+fields.commentsCount.integerValue +
                      +(fields.repliesCount?.integerValue || "0")}{" "}
                    comments] [{fields.pawCount.integerValue} paws] [
                    {fields.scratchCount.integerValue} scratches]
                  </span>
                  <span className="text-xs">
                    {formatDistanceToNow(
                      new Date(fields.createdAt.timestampValue),
                      { addSuffix: true },
                    )}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        );
      })}

      <div className="mt-4">
        {params.search.length > 0 ? (
          <div>
            Showing last 10 results for{" "}
            <span className="font-bold">{params.search}</span>
          </div>
        ) : (
          <button
            type="button"
            className="w-full bg-slate-200 py-2"
            onClick={() => {
              setSize(size + 1);
            }}
          >
            {isLoading || isValidating ? <Loading /> : "Load more"}
          </button>
        )}
      </div>
    </div>
  );
}
