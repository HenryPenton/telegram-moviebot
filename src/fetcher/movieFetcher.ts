import { Movie } from "../types";
import { fetcher } from "./fetcher";

export const getMovie = async (queryString: string): Promise<Movie> => {
  const splitQuery = queryString.split(" ");
  const urlQueryString = splitQuery.join("%20");
  return fetcher(
    `http://www.omdbapi.com/?t=${urlQueryString}&apikey=${process.env.MOVIE_DATABASE_KEY}`
  ).catch(() => ({ Response: "False" } as Movie));
};
