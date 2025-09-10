import type { LoaderFunctionArgs } from "@remix-run/node";
import { fomoSearch } from "~/lib/fomo";
import type { FomoSearchResults } from "~/types";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || "1";
  const query = url.searchParams.get("query") || "";

  if (!query) {
    return {
      data: [],
      meta: {
        total: 0,
        page: 1,
        limit: 10,
      },
    } as FomoSearchResults;
  }

  const response = await fomoSearch(query, Number.parseInt(page, 10));
  return response;
};
