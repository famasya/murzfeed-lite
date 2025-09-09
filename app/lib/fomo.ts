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

export const fomoGetPosts = (
  sort: "recent" | "trending" = "recent",
  page: number = 1,
) => {
  const response = fomoClient.get<FomoPostsResponse>("feed", {
    searchParams: {
      sortMode: sort.toUpperCase(),
      limit: 10,
      page,
    },
  });

  return response.json();
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
