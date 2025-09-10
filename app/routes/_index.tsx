import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { formatDistanceToNow } from "date-fns";
import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";
import { useEffect, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { getMurzfeedPosts } from "~/lib/firebase";
import type { MurzfeedPost } from "~/types";
import { useDebounce } from "~/utils";
import Loading from "./loading";

export const meta: MetaFunction = () => {
	return [
		{ title: "Murzfeed Lite" },
		{ name: "description", content: "Murzfeed w/ HN style" },
	];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const params = new URL(request.url).searchParams;
	const sortBy = params.get("sortBy") || "trending";
	const search = params.get("search") || "";
	// initial data
	const response = await getMurzfeedPosts({ ts: "first", id: "", sortBy, search });
	return response;
};

const sortOptions = [
	{ value: "newest", label: "Newest" },
	{ value: "trending", label: "Trending" },
	{ value: "last_activity", label: "Last Activity" },
];
export default function Index() {
	const initialPosts = useLoaderData<typeof loader>();
	const [params, setParams] = useQueryStates({
		sortBy: parseAsStringEnum(sortOptions.map((o) => o.value)).withDefault(
			"trending",
		),
		search: parseAsString.withDefault(""),
	});
	const [searchTerm, setSearchTerm] = useState(params.search);

	const getKey = (index: number, prev: MurzfeedPost[] | null) => {
		if (index === 0) return { ts: "first", id: "", sortBy: params.sortBy, search: params.search }; // first page
		const lastPost = prev?.[prev?.length - 1];
		if (!lastPost) return { ts: "first", id: "", sortBy: params.sortBy, search: params.search };
		return {
			ts: lastPost.createdAt.toISOString(),
			id: lastPost.id,
			sortBy: params.sortBy,
			search: params.search,
		};
	};
	const {
		data: newPosts,
		isLoading,
		isValidating,
		setSize,
		size,
	} = useSWRInfinite(getKey, async ({ ts, id, sortBy, search }) => {
		return await getMurzfeedPosts({ ts, id, sortBy, search });
	});

	const posts = newPosts ? newPosts.flat() : initialPosts;

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
				<div className="flex gap-2">
					{sortOptions.map((option) => (
						<Link
							key={option.value}
							to={`/?sortBy=${option.value}`}
							className={
								params.sortBy === option.value ? "font-bold underline" : ""
							}
						>
							{option.label}
						</Link>
					))}
				</div>
			</div>

			{params.search.length > 0 ? (
				<div>
					<span>Showing last results for "{params.search}"</span>{" "}
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
				const friendlyUrl = post.title
					.replace(/[^a-zA-Z0-9]/g, "-")
					.toLowerCase();
				return (
					<div
						key={post.id}
						className="my-2 bg-slate-50 p-2 border-[1px] border-slate-300 rounded-md"
					>
						<Link
							rel="prefetch"
							to={`/post/murz/${friendlyUrl}-${post.postId}`}
							className="flex flex-row gap-2 items-center justify-between"
						>
							<div className="w-full">
								<p className="font-bold">{post.title}</p>
								<p className="mt-2">{contentExcerpt(post.content)}</p>
								<div className="mt-4 flex flex-row justify-between items-center">
									<span className="text-blue-700 text-xs">
										[{post.commentsCount + post.repliesCount} comments] [
										{post.pawCount} paws] [{post.scratchCount} scratches]
									</span>
									<span className="text-xs">
										{formatDistanceToNow(post.createdAt, { addSuffix: true })}
									</span>
								</div>
							</div>
						</Link>
					</div>
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
