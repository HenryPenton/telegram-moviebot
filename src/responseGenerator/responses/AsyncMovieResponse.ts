import { Movie } from "../../fetcher/movie/movieFetcher";
import { Response } from "./Response";

export class MovieNotProvidedError extends Error {}
export class MovieAndYearNotProvidedError extends Error {}
export class MovieIDNotProvided extends Error {}

export abstract class AsyncMovieResponse extends Response {
  movie: Movie;
  queryString: string;
  constructor(queryString: string) {
    super();
    this.movie = {};
    this.queryString = queryString;
  }

  protected generateErrorReponse = (e: unknown) => {
    switch (true) {
      case e instanceof MovieNotProvidedError:
        return "Please specify a movie!";
      case e instanceof MovieIDNotProvided:
        return "Please specify an IMDB ID!";
      case e instanceof MovieAndYearNotProvidedError:
        return "Please specify a movie and year!";
      default:
        return "Something went wrong!";
    }
  };
}
