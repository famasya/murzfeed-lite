import type { LoaderFunctionArgs } from "@remix-run/node";
import { fomoGetComments } from "~/lib/fomo";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url);
	const postId = url.searchParams.get("postId");
	const page = url.searchParams.get("page") || "1";

	if (!postId) {
		throw new Response("Post ID is required", { status: 400 });
	}

	const response = await fomoGetComments(postId, Number.parseInt(page, 10));
	return response;
};
