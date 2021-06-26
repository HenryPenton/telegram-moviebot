import fetch from "node-fetch";

export const fetcher = async (
  url: string
): Promise<Record<string, unknown>> => {
  return fetch(url)
    .then((result) => result.json())
    .then((json) => json);
};
