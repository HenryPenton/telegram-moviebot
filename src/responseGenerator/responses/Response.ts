import { Movie } from "../../types";

export abstract class Response {
  movie: Movie;
  queryString: string;
  constructor(queryString: string) {
    this.movie = {};
    this.queryString = queryString;
  }

  abstract generateResponse = () => {};
  abstract getType = () => {};
  abstract getMovie = () => {};
}
