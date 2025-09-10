import ky from "ky";
import type {
	FomoCommentsResponse,
	FomoPostsResponse,
	FomoSearchResults,
	FomoSinglePost,
} from "~/types";

export const fomoClient = ky.create({
	headers: {
		authorization: `${process.env.FOMO_TOKEN}`,
	},
	prefixUrl: "https://fomo.azurewebsites.net",
});

export const fomoGetPosts = async (
	sort: "recent" | "trending" = "recent",
	page: number = 1,
) => {
	const response = await fomoClient.get<FomoPostsResponse>("feed", {
		searchParams: {
			sortMode: sort.toUpperCase(),
			limit: 10,
			page,
		},
	});

	// filter out INTERNAL_PROMO, PROMO
	const posts = await response.json();
	const filteredPosts = posts.data.filter(
		(post) =>
			![
				"INTERNAL_PROMO",
				"PROMO",
				"SALARY",
				"COMPANY_REVIEW",
				"TALENT_POST",
			].includes(post.inner.type),
	);

	return { data: filteredPosts };
};

export const fomoGetPost = async (activityId: string) => {
	const response = await fetch("https://fomo.azurewebsites.net/activity", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			authorization: process.env.FOMO_TOKEN as string,
		},
		body: JSON.stringify({
			activityId,
		}),
	});
	return response.json() as Promise<FomoSinglePost>;
};

export const fomoGetComments = async (postId: string, page: number = 1) => {
	const response = await fomoClient.get<FomoCommentsResponse>(
		`activity/${postId}/comments`,
		{
			searchParams: {
				limit: 20,
				page,
				sortMode: "RECENT",
			},
		},
	);

	return response.json();
};

export const fomoSearch = async (query: string, page: number = 1) => {
	const parsedQuery = query.replace(" ", "%20");
	const response = await fomoClient.get<FomoSearchResults>(
		`post/searchV3/${parsedQuery}`,
		{
			searchParams: {
				limit: 10,
				page,
			},
		},
	);

	return response.json();
};
