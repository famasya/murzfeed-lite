import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import useSWRMutation from "swr/mutation";
import { reformatUrls } from "~/utils";
import type { CommentsResponse, Replies } from "./comments";

// Simple type for the post response since it's a direct API call
type PostResponse = Array<{
	document?: {
		name: string;
		fields: {
			title: { stringValue: string };
			content: { stringValue: string };
			username: { stringValue: string };
			isAnonymous: { booleanValue: boolean };
			pawCount: { integerValue: string };
			scratchCount: { integerValue: string };
			commentsCount: { integerValue: string };
			repliesCount?: { integerValue: string };
			titleSlug: { stringValue: string };
			createdAt: { timestampValue: string };
			imageURL: {
				arrayValue: {
					values?: Array<{ stringValue: string }>;
				};
			};
		};
	};
	readTime: string;
}>;

const baseFetch =
	"https://firestore.googleapis.com/v1/projects/mfeed-c43b1/databases/(default)/documents:runQuery";
export const loader = async ({ params }: LoaderFunctionArgs) => {
	const postId = params.id?.split("-").pop();
	const getPost = await fetch(baseFetch, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			structuredQuery: {
				where: {
					fieldFilter: {
						field: {
							fieldPath: "postId",
						},
						op: "EQUAL",
						value: {
							stringValue: postId,
						},
					},
				},
				orderBy: {
					field: {
						fieldPath: "createdAt",
					},
					direction: "DESCENDING",
				},
				from: [
					{
						collectionId: "posts",
					},
				],
			},
		}),
	});
	const post = (await getPost.json()) as PostResponse;

	const getComments = await fetch(baseFetch, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			structuredQuery: {
				where: {
					fieldFilter: {
						field: {
							fieldPath: "postId",
						},
						op: "EQUAL",
						value: {
							stringValue: postId,
						},
					},
				},
				orderBy: {
					field: {
						fieldPath: "createdAt",
					},
					direction: "DESCENDING",
				},
				from: [
					{
						collectionId: "comments",
					},
				],
			},
		}),
	});
	const comments = (await getComments.json()) as CommentsResponse;

	return { comments, post: post[0] };
};

export const meta: MetaFunction = ({ data }: { data: unknown }) => {
	const response = data as Awaited<ReturnType<typeof loader>>;
	return [
		{
			title: response.post.document?.fields.title.stringValue || "Not found",
		},
	];
};

export default function Post() {
	const { comments, post } = useLoaderData<typeof loader>();
	const [replies, setReplies] = useState<Map<string, Replies>>(new Map());

	const { trigger } = useSWRMutation(
		"loadReplies",
		async (_, { arg }: { arg: string }) => {
			const getReplies = await fetch(
				`https://firestore.googleapis.com/v1/projects/mfeed-c43b1/databases/(default)/documents/comments/${arg}/replies`,
			);
			const replies = (await getReplies.json()) as Replies;
			if (!replies.documents) return { arg, replies: { documents: [] } };
			const orderedReplies = replies.documents.sort((a, b) => {
				return (
					new Date(b.fields.createdAt.timestampValue).getTime() -
					new Date(a.fields.createdAt.timestampValue).getTime()
				);
			});
			return { arg, replies: { documents: orderedReplies } };
		},
		{
			onSuccess: ({ arg, replies }) => {
				setReplies((prev) => new Map(prev).set(arg, replies));
			},
		},
	);

	if (!post.document) {
		return <div className="mt-2">Not found. U lost son?</div>;
	}
	const fields = post.document.fields;
	const img = fields.imageURL.arrayValue?.values?.[0].stringValue;
	return (
		<div className="mt-2 mb-8">
			<h1 className="font-bold text-lg">{fields.title.stringValue}</h1>
			<p className="my-1">{img && <img src={img} alt="" />}</p>
			<p
				className="my-2"
				/* biome-ignore lint/security/noDangerouslySetInnerHtml: parsed */
				dangerouslySetInnerHTML={{
					__html: reformatUrls(fields.content.stringValue),
				}}
			/>
			<div className="my-2 flex flex-row justify-between bg-orange-100 p-1 border-[1px] border-orange-200 rounded">
				<div className="space-x-1">
					<span>
						{fields.isAnonymous ? "Anonymous" : fields.username.stringValue}{" "}
						&bull;
					</span>
					<span>{fields.pawCount.integerValue} paws &bull;</span>
					<span>{fields.scratchCount.integerValue} scratches &bull;</span>
					<span>
						{+fields.commentsCount.integerValue +
							+(fields.repliesCount?.integerValue || "0")}{" "}
						comments &bull;
					</span>
					<span>
						{formatDistanceToNow(new Date(fields.createdAt.timestampValue), {
							addSuffix: true,
						})}
					</span>
				</div>
				<Link
					className="text-orange-700 font-semibold"
					to={`https://murzfeed.com/p/${fields.titleSlug.stringValue}`}
					target="_blank"
					rel="noreferrer"
				>
					[OP]
				</Link>
			</div>

			<div className="flex flex-col gap-2 pt-2 border-t-[1px]">
				{comments.map((comment) => {
					if (!comment.document) {
						return <div key={comment.readTime}>No comment</div>;
					}

					const { fields } = comment.document;
					const commentReplies = replies.get(fields.commentId.stringValue);
					return (
						// biome-ignore lint/a11y/noStaticElementInteractions: comment section
						<div
							className="bg-gradient-to-l from-white to-slate-100 border-[1px] rounded-md p-2 border-slate-300"
							key={fields.commentId.stringValue}
							onClick={() => trigger(fields.commentId.stringValue)}
							onKeyDown={(e) =>
								e.key === "Enter" && trigger(fields.commentId.stringValue)
							}
						>
							<p className="text-slate-500">
								{fields.isCommenterSetAnonymous?.booleanValue
									? "Anonymous"
									: fields.username.stringValue}{" "}
								[
								{formatDistanceToNow(
									new Date(fields.createdAt.timestampValue),
									{ addSuffix: true },
								)}
								]
							</p>
							<div
								/* biome-ignore lint/security/noDangerouslySetInnerHtml: parsed */
								dangerouslySetInnerHTML={{
									__html: reformatUrls(fields.content.stringValue),
								}}
							/>
							<div className="text-xs text-slate-500 justify-end flex">
								<button type="button">
									{fields.repliesCount.integerValue !== "0" && (
										<>
											[Tap to load {fields.repliesCount.integerValue} replies]
										</>
									)}
								</button>
							</div>

							{/* Replies */}
							{commentReplies?.documents?.map((document) => {
								if (!document) return undefined;
								const { fields } = document;
								let commenter = fields.isReplierSetAnonymous.booleanValue
									? "Anonymous"
									: fields.replyCreatorUsername.stringValue;
								if (fields.isDelete.booleanValue) commenter = "[deleted]";
								return (
									<div
										key={fields.replyId.stringValue}
										className="pl-4 border-l-4 border-slate-400 mb-2"
									>
										<p className="text-slate-500">
											{commenter} [
											{formatDistanceToNow(
												new Date(fields.createdAt.timestampValue),
												{ addSuffix: true },
											)}
											]
										</p>
										<pre
											className="whitespace-pre-wrap font-sans"
											/* biome-ignore lint/security/noDangerouslySetInnerHtml: parsed */
											dangerouslySetInnerHTML={{
												__html: reformatUrls(
													fields.isDelete.booleanValue
														? "[deleted]"
														: fields.reply.stringValue,
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
			<div className="text-center my-2">
				<a href="#header">Back to Top</a>
			</div>
		</div>
	);
}
