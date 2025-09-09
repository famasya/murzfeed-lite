import type { HeadersFunction, LinksFunction } from "@remix-run/node";
import {
	Link,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLocation,
	useNavigate,
	useNavigation,
} from "@remix-run/react";

import { NuqsAdapter } from "nuqs/adapters/remix";
import { useId } from "react";
import Loading from "./routes/loading";
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
	"Cache-Control": "s-maxage=60, stale-while-revalidate=600",
});

export function Layout({ children }: { children: React.ReactNode }) {
	const navigation = useNavigation();
	const location = useLocation();
	const navigate = useNavigate();
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
						<div
							className="bg-orange-700 text-white p-2 flex flex-row justify-between"
							id={useId()}
						>
							<div className="flex flex-row items-center space-x-2">
								<Link
									rel="prefetch"
									to="/"
									onClick={(e) => {
										const isHistoryAvailable = window.history.state.idx !== 0;
										if (
											location.pathname.includes("post") &&
											isHistoryAvailable
										) {
											e.preventDefault();
											navigate(-1);
										}
									}}
									className="text-white font-bold"
								>
									Murzfeed Lite
								</Link>
							</div>
							<div className="space-x-2 flex flex-row items-center">
								{navigation.state !== "idle" ? <Loading /> : null}
								<Link rel="prefetch" to="/about" className="text-white">
									[about]
								</Link>
								<a href="/rss" className="text-white">
									[rss]
								</a>
								<Link
									to="https://github.com/famasya/murzfeed-lite"
									rel="noreferrer"
									target="_blank"
									className="text-white"
								>
									[code]
								</Link>
							</div>
						</div>
						<div className="px-2">
							<NuqsAdapter>{children}</NuqsAdapter>
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
