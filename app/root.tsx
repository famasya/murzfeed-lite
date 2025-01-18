import type { HeadersFunction, LinksFunction } from "@remix-run/node";
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from "@remix-run/react";

import { NuqsAdapter } from "nuqs/adapters/remix";
import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const headers: HeadersFunction = () => ({
  'Cache-Control': 's-maxage=60, stale-while-revalidate=600',
});

export function Layout({ children }: { children: React.ReactNode }) {
  const navigation = useNavigation();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex flex-col items-center w-full text-sm">
          <div className="w-full max-w-[800px]">
            <div className="bg-orange-700 text-white p-2 flex flex-row justify-between" id="header">
              <Link rel="prefetch" to="/" className="text-white font-bold">
                Murzfeed Lite
              </Link>
              <div className="space-x-2 flex flex-row items-center">
                {navigation.state !== "idle" ?
                  <div className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" /> : null}
                <Link rel="prefetch" to="/about" className="text-white">[about]</Link>
                <Link to="https://github.com/famasya/murzfeed-lite" rel="noreferrer" target="_blank" className="text-white">[code]</Link>
              </div>
            </div>
            <div className="px-2">
              <NuqsAdapter>
                {children}
              </NuqsAdapter>
            </div>
          </div>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
