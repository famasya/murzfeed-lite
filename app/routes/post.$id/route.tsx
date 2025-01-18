import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import useSWRMutation from "swr/mutation";
import { reformatUrls } from "~/utils";
import type { PostResponse } from "../posts";
import type { CommentsResponse, Replies } from "./comments";

const baseFetch =
  "https://firestore.googleapis.com/v1/projects/mfeed-c43b1/databases/(default)/documents:runQuery";
export const loader = async ({ params }: LoaderFunctionArgs) => {
  const postId = params.id?.split('-').pop()
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
          direction: "DESCENDING"
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
          direction: "DESCENDING"
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
  const [replies, setReplies] = useState<Map<string, Replies>>(new Map())

  const { trigger } = useSWRMutation("loadReplies", async (_, { arg }: { arg: string }) => {
    const getReplies = await fetch(`https://firestore.googleapis.com/v1/projects/mfeed-c43b1/databases/(default)/documents/comments/${arg}/replies`)
    const replies = (await getReplies.json()) as Replies;
    const orderedReplies = replies.documents.sort((a, b) => {
      return new Date(b.fields.createdAt.timestampValue).getTime() - new Date(a.fields.createdAt.timestampValue).getTime()
    })
    return { arg, replies: { documents: orderedReplies } }
  }, {
    onSuccess: ({ arg, replies }) => {
      setReplies(prev => new Map(prev).set(arg, replies))
    }
  })

  if (!post.document) {
    return <div className="mt-2">Not found. U lost son?</div>;
  }

  const img = post.document.fields.imageURL.arrayValue?.values?.[0].stringValue
  return (
    <div className="mt-2 mb-8" id="top">
      <h1 className="font-bold text-lg">{post.document.fields.title.stringValue}</h1>
      <p className="my-1">{img && <img src={img} alt="" />}</p>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: parsed */}
      <p className="my-2" dangerouslySetInnerHTML={{ __html: reformatUrls(post.document.fields.content.stringValue) }} />
      <p className="my-2"><Link className="text-red-600 font-semibold" to={`https://murzfeed.com/p/${post.document.fields.titleSlug.stringValue}`} target="_blank" rel="noreferrer">[Original post]</Link></p>

      <div className="flex flex-col gap-2 pt-2 border-t-[1px]">
        {comments.map((comment) => {
          if (!comment.document) {
            return <div key={comment.readTime}>No comment</div>;
          }

          const { document } = comment;
          const commentReplies = replies.get(document.fields.commentId.stringValue)
          return (
            <div className="bg-gradient-to-l from-white to-slate-100 border-[1px] rounded-md p-2" key={document.fields.commentId.stringValue} onClick={() => trigger(document.fields.commentId.stringValue)} onKeyDown={(e) => e.key === 'Enter' && trigger(document.fields.commentId.stringValue)}>
              <p className="text-slate-500">
                {document.fields.isCommenterSetAnonymous.booleanValue ? 'Anonymous' : document.fields.username.stringValue} [
                {formatDistanceToNow(
                  new Date(document.fields.createdAt.timestampValue),
                  { addSuffix: true },
                )}
                ]
              </p>
              {/* biome-ignore lint/security/noDangerouslySetInnerHtml: parsed */}
              <div dangerouslySetInnerHTML={{ __html: reformatUrls(document.fields.content.stringValue) }} />
              <div className="text-xs text-slate-500 justify-end flex">
                <button type="button">[Tap to load {document.fields.repliesCount.integerValue} replies]</button>
              </div>

              {/* Replies */}
              {commentReplies?.documents.map((document) => {
                if (!document) return;
                let commenter = document.fields.isReplierSetAnonymous.booleanValue ? 'Anonymous' : document.fields.commentUsername.stringValue
                if (document.fields.isDelete.booleanValue) commenter = '[deleted]'
                return (
                  <div key={document.fields.replyId.stringValue} className="pl-4 border-l-4 border-slate-400 mb-2">
                    <p className="text-slate-500">
                      {commenter} [
                      {formatDistanceToNow(
                        new Date(document.fields.createdAt.timestampValue),
                        { addSuffix: true },
                      )}
                      ]
                    </p>
                    {/* biome-ignore lint/security/noDangerouslySetInnerHtml: parsed */}
                    <div dangerouslySetInnerHTML={{ __html: reformatUrls(document.fields.isDelete.booleanValue ? '[deleted]' : document.fields.reply.stringValue) }} />
                  </div>
                )
              })}
            </div>
          );
        })}
      </div>
      <div className="text-center my-2"><a href="#top">Back to Top</a></div>
    </div>
  );
}
