export default function RSS() {
	return (
		<div>
			<h1>RSS</h1>
			<ol className="list-decimal list-inside mt-4">
				<li>
					<a href="/rss/murzfeed" className="text-blue-700 hover:underline">
						Murzfeed
					</a>
				</li>
				<li>
					<a href="/rss/fomo" className="text-blue-700 hover:underline">
						Fomo
					</a>
				</li>
			</ol>
		</div>
	);
}
