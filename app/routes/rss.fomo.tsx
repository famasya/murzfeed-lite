import type { HeadersFunction, LoaderFunction } from "@remix-run/node";
import { fomoGetPosts } from "~/lib/fomo";

type RssEntry = {
	title: string;
	link: string;
	description: string;
	pubDate: string;
	author?: string;
	guid?: string;
};

export const headers: HeadersFunction = () => ({
	"Cache-Control": "s-maxage=600, stale-while-revalidate=1800",
});

const generateRss = ({
	description,
	entries,
	link,
	title,
}: {
	title: string;
	description: string;
	link: string;
	entries: RssEntry[];
}) => {
	return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${title}</title>
    <description>${description}</description>
    <link>${link}</link>
    <language>en-us</language>
    <ttl>60</ttl>
    <atom:link href="https://murzlite.vercel.app/rss/fomo" rel="self" type="application/rss+xml" />
    ${entries
			.map(
				(entry) => `
      <item>
        <title><![CDATA[${entry.title}]]></title>
        <description><![CDATA[${entry.description}]]></description>
        <pubDate>${entry.pubDate}</pubDate>
        <link>${entry.link}</link>
        ${entry.guid ? `<guid isPermaLink="false">${entry.guid}</guid>` : ""}
      </item>`,
			)
			.join("")}
  </channel>
</rss>`;
};

export const loader: LoaderFunction = async () => {
	const posts = await fomoGetPosts("recent", 1);

	const feed = generateRss({
		title: "Murzfeed + fomo Lite",
		description: "Murzfeed + fomo Lite - Murzfeed w/ HN Style",
		link: "https://murzlite.vercel.app/fomo",
		entries: posts.data.map((post) => {
			const friendlyUrl = post.inner.title
				?.replace(/[^a-zA-Z0-9]/g, "-")
				?.toLowerCase();
			return {
				description: post.inner.content as string,
				pubDate: post.inner.creationTime as string,
				title: post.inner.title as string,
				link: `https://murzlite.vercel.app/post/fomo/${friendlyUrl}-${post.inner.activityId}`,
				guid: `https://murzlite.vercel.app/post/fomo/${friendlyUrl}-${post.inner.activityId}`,
			};
		}),
	});

	return new Response(feed, {
		headers: {
			"Content-Type": "application/xml",
		},
	});
};
