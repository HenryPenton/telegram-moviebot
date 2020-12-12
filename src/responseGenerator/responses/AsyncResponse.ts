import { Movie } from "../../types";
import { Response } from "./Response";

export abstract class AsyncResponse extends Response {
  movie: Movie;
  queryString: string;
  constructor(queryString: string) {
    super();
    this.movie = {};
    this.queryString = queryString;
  }

  abstract getMovie: () => void;
}
