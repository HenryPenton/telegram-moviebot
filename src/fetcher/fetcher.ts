import fetch from "node-fetch";

export type UnknownObject = { [key: string]: number | string | [] };

export const fetcher = async (url: string): Promise<UnknownObject> => {
  return fetch(url)
    .then((result) => result.json())
    .then((json) => json);
};
