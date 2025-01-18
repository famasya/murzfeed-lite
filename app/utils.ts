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