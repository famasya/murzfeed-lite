import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { formatDistanceToNow } from "date-fns";
import ky from "ky";
import { useState } from "react";
import useSWRMutation from "swr/mutation";
import { fomoGetPost } from "~/lib/fomo";
import type { FomoComment, FomoCommentsResponse } from "~/types";
import { reformatUrls } from "~/utils";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	const postId = params.id?.split("-").pop();

	if (!postId) {
		throw new Error("Invalid post ID");
	}

	const url = new URL(request.url);
	const baseUrl = `${url.protocol}//${url.host}`;

	const [post, comments] = await Promise.all([
		fomoGetPost(postId),
		ky
			.get(`${baseUrl}/api/fomo/comments?postId=${postId}&page=1`)
			.json<FomoCommentsResponse>(),
	]);

	return { post, comments };
};

export const meta: MetaFunction = ({ data }: { data: unknown }) => {
	const response = data as Awaited<ReturnType<typeof loader>>;
	return [
		{
			title: response.post.inner?.title || "Not found",
		},
	];
};

export default function FomoPost() {
	const { comments: initialComments, post } = useLoaderData<typeof loader>();
	const [replies, setReplies] = useState<Map<number, FomoComment[]>>(new Map());
	const [allComments, setAllComments] = useState<FomoCommentsResponse["data"]>(
		initialComments.data,
	);
	const [currentPage, setCurrentPage] = useState<number>(2);
	const [hasMoreComments, setHasMoreComments] = useState<boolean>(
		initialComments.data.length === 20,
	);

	const loadReplies = (commentId: number, childComments: FomoComment[]) => {
		if (childComments.length > 0) {
			setReplies((prev) => new Map(prev).set(commentId, childComments));
		}
	};

	const { trigger: loadMoreComments, isMutating: isLoadingMore } =
		useSWRMutation(
			"loadMoreComments",
			async () => {
				const postId = post.inner.activityId.toString();
				const newComments = await ky
					.get(`/api/fomo/comments?postId=${postId}&page=${currentPage}`)
					.json<FomoCommentsResponse>();

				// If returned comments are less than 20 (items per page), no more comments to load
				if (newComments.data.length < 20) {
					setHasMoreComments(false);
				}

				return newComments;
			},
			{
				onSuccess: (newComments) => {
					setAllComments((prev) => [...prev, ...newComments.data]);
					setCurrentPage((prev) => prev + 1);
				},
			},
		);

	if (!post.inner) {
		return <div className="mt-2">Not found. U lost son?</div>;
	}

	const { inner } = post;
	const img = inner.imageUrl;

	return (
		<div className="mt-2 mb-8">
			<h1 className="font-bold text-lg">{inner.title}</h1>
			<p className="my-1">{img && <img src={img} alt="" />}</p>
			<pre
				className="whitespace-pre-wrap font-sans"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: ignored
				dangerouslySetInnerHTML={{
					__html: reformatUrls(inner.content || ""),
				}}
			/>
			<div className="my-2 flex flex-row justify-between bg-blue-100 p-1 border-[1px] border-blue-200 rounded">
				<div className="space-x-1">
					<div>{inner.user?.username || "Anonymous"} [{inner.user.companyName}]</div>
					<div className="flex space-x-1">
						<span>{inner.numberOfLikes || 0} 👍 </span>
						<span>{inner.numberOfDislikes || 0} 👎 </span>
						<span>{inner.numberOfComments || 0} 💬 </span>
						<span>
							{formatDistanceToNow(new Date(inner.creationTime || ""), {
								addSuffix: true,
							})}
						</span>
					</div>
				</div>
				<Link
					className="text-blue-700 font-semibold"
					to={`https://fomo.id/activity/${inner.activityId}`}
					target="_blank"
					rel="noreferrer"
				>
					[OP]
				</Link>
			</div>

			<div className="flex flex-col gap-2 pt-2 border-t-[1px]">
				{allComments.map((comment) => {
					if (!comment.inner) {
						return <div key={`no-comment`}>No comment</div>;
					}

					const { inner: commentInner } = comment;
					const commentReplies = replies.get(commentInner.activityId);
					const hasReplies =
						commentInner.comments && commentInner.comments.length > 0;

					return (
						// biome-ignore lint/a11y/noStaticElementInteractions: ignored
						<div
							className="bg-gradient-to-l from-white to-slate-100 border-[1px] rounded-md p-2 border-slate-300"
							key={commentInner.activityId}
							onClick={() =>
								hasReplies &&
								loadReplies(commentInner.activityId, commentInner.comments)
							}
							onKeyDown={(e) =>
								e.key === "Enter" &&
								hasReplies &&
								loadReplies(commentInner.activityId, commentInner.comments)
							}
						>
							<p className="text-slate-500">
								{commentInner.user?.username || "Anonymous"} [
								{formatDistanceToNow(new Date(commentInner.creationTime), {
									addSuffix: true,
								})}
								]
							</p>
							<pre
								className="whitespace-pre-wrap font-sans"
								// biome-ignore lint/security/noDangerouslySetInnerHtml: ignored
								dangerouslySetInnerHTML={{
									__html: reformatUrls(commentInner.value),
								}}
							/>
							{hasReplies && (
								<div className="text-xs text-slate-500 justify-end flex">
									<button type="button">
										[Tap to load {commentInner.comments.length} replies]
									</button>
								</div>
							)}

							{commentReplies?.map((reply) => {
								if (!reply) return undefined;
								let commenter = reply.user?.username || "Anonymous";
								if (reply.deleted) commenter = "[deleted]";
								return (
									<div
										key={reply.activityId}
										className="pl-4 border-l-4 border-slate-400 mb-2"
									>
										<p className="text-slate-500">
											{commenter} [
											{formatDistanceToNow(new Date(reply.creationTime), {
												addSuffix: true,
											})}
											]
										</p>
										<pre
											className="whitespace-pre-wrap font-sans"
											// biome-ignore lint/security/noDangerouslySetInnerHtml: ignored
											dangerouslySetInnerHTML={{
												__html: reformatUrls(
													reply.deleted ? "[deleted]" : reply.value,
												),
											}}
										/>
									</div>
								);
							})}
						</div>
					);
				})}
			</div>

			{hasMoreComments && (
				<div className="text-center my-4">
					<button
						type="button"
						onClick={() => loadMoreComments()}
						disabled={isLoadingMore}
						className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
					>
						{isLoadingMore ? "Loading..." : "Load More Comments"}
					</button>
				</div>
			)}
		</div>
	);
}
