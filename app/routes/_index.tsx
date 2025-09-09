import type { MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { formatDistanceToNow } from "date-fns";
import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";
import { useEffect, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { firebaseFetcher } from "~/lib/firebase";
import type { MurzfeedPost } from "~/types";
import { useDebounce } from "~/utils";
import Loading from "./loading";

export const meta: MetaFunction = () => {
	return [
		{ title: "Murzfeed Lite" },
		{ name: "description", content: "Murzfeed w/ HN style" },
	];
};

export const loader = async () => {
	// initial data
	const response = await firebaseFetcher({
		includeAllCategories: false,
		orderByField: "createdAt",
		orderDirection: "desc",
		limitCount: 10,
	});
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

	const getKey = (index: number, prev: MurzfeedPost[] | null) => {
		if (index === 0) return ["first", null, params.sortBy, params.search]; // first page
		const lastPost = prev?.[prev?.length - 1];
		return [
			lastPost?.createdAt?.toISOString(),
			lastPost?.id,
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
	} = useSWRInfinite(getKey, async ([ts, id, sortBy, search]) => {
		console.log(1, ts, id, sortBy, search)
		if (ts === "first" && sortBy === "newest" && search === "")
			return initialPosts; // fallback

		const includeAllCategories =
			sortBy === "last_activity" || sortBy === "newest_all";
		const orderByField =
			sortBy === "last_activity" || sortBy === "newest_all"
				? "latestCommentCreatedAt"
				: "createdAt";

		const startAfterValues =
			ts === "first"
				? undefined
				: {
					timestamp: new Date(ts as string),
					id: id as string,
				};


		const results = await firebaseFetcher({
			includeAllCategories,
			orderByField,
			orderDirection: "desc",
			limitCount: 10,
			startAfterValues,
			searchTerm: search || undefined,
		});

		return results;
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
				<div>
					{params.search.length < 1 ? (
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
					) : null}
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
							to={`/post/${friendlyUrl}-${post.postId}`}
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
