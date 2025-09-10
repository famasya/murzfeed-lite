import { fomoGetPost } from "~/lib/fomo";

(async () => {
  const request = await fomoGetPost("6718497")
  console.log(request);
})();
