import { useEffect, useState } from "react";

export const firebaseFetcher = async <Response = object>(query: object) => {
  const request = await fetch("https://firestore.googleapis.com/v1/projects/mfeed-c43b1/databases/(default)/documents:runQuery", {
    method: "post",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(query)
  })
  const response = await request.json() as Response;
  return response;
}

export const reformatUrls = (text: string) => {
  const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

  return text.replace(urlRegex, (url) => {
    const href = url.startsWith('www.') ? `https://${url}` : url;
    return `<a href="${href}" target="_blank" class="underline">${url}</a>`;
  });
}

export const useDebounce = (value: string, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delay]);

  return debouncedValue;
};
