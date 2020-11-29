import fetch from "node-fetch";

export const fetcher = async (url: string) => {
  return fetch(url)
    .then((result) => result.json())
    .then((json) => json)
    .catch((e) => ({ Response: "False", err: e }));
};



