import type { LoaderFunctionArgs } from "@remix-run/node";
import { fomoGetPosts } from "~/lib/fomo";

export function headers() {
	return {
		"Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=86400",
	}
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url);
	const page = url.searchParams.get("page") || "1";
	let sortBy = url.searchParams.get("sortBy") || "recent";
	if (!["trending", "recent"].includes(sortBy)) {
		sortBy = "recent";
	}
	const response = await fomoGetPosts(
		sortBy as "recent" | "trending",
		Number.parseInt(page, 10),
	);
	return Response.json(response);
};
