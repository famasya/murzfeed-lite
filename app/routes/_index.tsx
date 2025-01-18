import type { MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { formatDistanceToNow } from "date-fns";
import { parseAsStringEnum, useQueryState } from "nuqs";
import useSWRInfinite from "swr/infinite";
import { firebaseFetcher } from "~/utils";
import type { Posts } from "./posts";

export const meta: MetaFunction = () => {
  return [
    { title: "Murzfeed Lite" },
    { name: "description", content: "Murzfeed w/ HN style" },
  ];
};

export const loader = async () => {
  // initial data
  const response = await firebaseFetcher<Posts>({
    structuredQuery: {
      from: [
        {
          collectionId: "posts"
        }
      ],
      orderBy: {
        field: {
          fieldPath: "createdAt"
        },
        direction: "DESCENDING"
      },
      limit: 10
    }
  })
  return response;
};

export default function Index() {
  const initialPosts = useLoaderData<typeof loader>();
  const [sortBy, setSort] = useQueryState("sortBy", parseAsStringEnum(["newest", "trending"]).withDefault("newest"));
  const getKey = (index: number, prev: Posts | null) => {
    if (index === 0) return ['first', sortBy]; // first page
    return [prev?.[prev?.length - 1].document?.fields.createdAt.timestampValue, sortBy];
  }
  const { data: newPosts, isLoading, isValidating, setSize, size } = useSWRInfinite(getKey, async ([ts, sortBy]) => {
    if (ts === 'first' && sortBy === "newest") return initialPosts; // fallback
    const orderBy = sortBy === "newest" ? "createdAt" : "latestCommentCreatedAt";
    return firebaseFetcher<Posts>({
      structuredQuery: {
        from: [
          {
            collectionId: "posts"
          }
        ],
        orderBy: {
          field: {
            fieldPath: orderBy
          },
          direction: "DESCENDING"
        },
        limit: 10,
        ...(ts ? {
          startAt: {
            values: [
              {
                timestampValue: ts === "first" ? new Date().toISOString() : ts
              }
            ],
          }
        } : {})
      }
    })
  })
  const posts = newPosts ? newPosts.flat() : [];

  const contentExcerpt = (content: string) => {
    const trimmed = content.split(' ').slice(0, 20).join(' ')
    const text = `${trimmed.length < 100 ? trimmed : trimmed.substring(0, 100)}`
    return trimmed.length >= content.length ? text : `${text}...`
  }

  return <div className="mb-8">
    <div className="my-2 flex items-center gap-2 justify-end text-xs">
      Order by
      <select className="px-2 border-2" onChange={(e) => setSort(e.target.value as "newest" | "trending")}>
        <option value="newest">Newest</option>
        <option value="trending">Trending</option>
      </select>
    </div>
    {posts.map(({ document: post }) => {
      if (!post) return;
      const friendlyUrl = post.fields.title.stringValue.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      return (
        <div key={post.name} className="my-2 bg-slate-50 p-2 border-[1px] border-slate-200 rounded-md">
          <Link rel="prefetch" to={`/post/${friendlyUrl}-${post.fields.postId.stringValue}`} className="flex flex-row gap-2 items-center justify-between">
            <div className="w-full">
              <p className="font-bold">{post.fields.title.stringValue}</p>
              <p className="mt-2">
                {contentExcerpt(post.fields.content.stringValue)}
              </p>
              <div className="mt-4 flex flex-row justify-between items-center">
                <span className="text-blue-700 text-xs">
                  [{+(post.fields.commentsCount.integerValue) + +(post.fields.repliesCount.integerValue)} comments]
                  [{post.fields.pawCount.integerValue} paws]
                  [{post.fields.scratchCount.integerValue} scratches]
                </span>
                <span className="text-xs">{formatDistanceToNow(new Date(post.fields.createdAt.timestampValue), { addSuffix: true })}</span>
              </div>
            </div>
          </Link>
        </div>
      )
    })}

    <div className="mt-4">
      <button type="button" className="w-full bg-slate-200 py-2" onClick={() => {
        setSize(size + 1)
      }}>{isLoading || isValidating ? "Loading..." : "Load more"}</button>
    </div>
  </div>
}
