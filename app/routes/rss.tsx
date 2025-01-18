import type { HeadersFunction, LoaderFunction } from "@remix-run/node";
import { loader as getPosts } from "./_index";

type RssEntry = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  author?: string;
  guid?: string;
};

export const headers: HeadersFunction = () => ({
  'Cache-Control': 's-maxage=600, stale-while-revalidate=1800',
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
    <atom:link href="https://murzlite.vercel.app/rss" rel="self" type="application/rss+xml" />
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
  const posts = await getPosts();

  const feed = generateRss({
    title: "Murz Lite",
    description: "Murz Lite - Murzfeed w/ HN Style",
    link: "https://murzlite.vercel.app",
    entries: posts
    .filter((post) => post.document)
    .map(({document}) => {
      const friendlyUrl = document!.fields.title.stringValue.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      return {
        description: document!.fields.content.stringValue,
        pubDate: new Date(document!.fields.createdAt.timestampValue).toUTCString(),
        title: document!.fields.title.stringValue,
        link: `https://murzlite.vercel.app/post/${friendlyUrl}-${document!.fields.postId.stringValue}`,
        guid: `https://murzlite.vercel.app/post/${friendlyUrl}-${document!.fields.postId.stringValue}`,
      }
    }),
  });

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
};
