import ky from "ky";
import type {
  FomoCommentsResponse,
  FomoPostsResponse,
  FomoSearchResults,
} from "~/types";

const fomoClient = ky.create({
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
  const filteredPosts = posts.data.filter((post) => !["INTERNAL_PROMO", "PROMO", "SALARY"].includes(post.inner.type));

  return { data: filteredPosts };
};

export const fomoGetComments = (postId: string, page: number = 1) => {
  const response = fomoClient.get<FomoCommentsResponse>(
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

export const fomoSearch = (query: string, page: number = 1) => {
  const parsedQuery = query.replace(" ", "%20");
  const response = fomoClient.get<FomoSearchResults>(
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
