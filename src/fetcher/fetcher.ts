import fetch from "node-fetch";

export type UnknownObject = { [key: string]: number | string | [] };
type Url = string;

export const fetcher = async (url: Url): Promise<UnknownObject> => {
  return fetch(url)
    .then((result) => result.json())
    .then((json) => json);
};
