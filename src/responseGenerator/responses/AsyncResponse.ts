import { Movie } from "../../fetcher/movie/movieFetcher";
import { Response } from "./Response";

export class MovieNotProvidedError extends Error {}
export class MovieAndYearNotProvidedError extends Error {}
export class MovieIDNotProvided extends Error {}

export abstract class AsyncResponse extends Response {
  movie: Movie;
  queryString: string;
  constructor(queryString: string) {
    super();
    this.movie = {};
    this.queryString = queryString;
  }
}
