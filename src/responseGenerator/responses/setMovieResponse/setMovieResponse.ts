import { getMovie } from "../../../fetcher/movie/movieFetcher";
import { ResponseType } from "../../../messageHandler/messageHandler";
import { State } from "../../../State/State";
import { Movie } from "../../../types";
import { Response } from "../Response";

export class SetMovieResponse extends Response {
  movieName: string;
  state: State;
  completeResponse: string;
  movie: Movie;

  constructor(queryString: string, state: State) {
    super();
    this.movie = {};
    this.state = state;
    this.movieName = queryString;
    this.completeResponse = "";
  }
  getType = () => ResponseType.message;

  getMovie = async () => {
    this.movie = await getMovie(this.movieName);
  };

  movieWithOrWithoutRating = () => {};

  isSuccessful = () => this.movie.Response === "True";

  getMovieRatings = () => {
    let setMovieRating;
    if (this.movie.Ratings) {
      if (this.movie.Ratings.length > 0) {
        setMovieRating = `(${
          this.movie.Ratings[0].Source === "Internet Movie Database"
            ? "IMDb"
            : this.movie.Ratings[0].Source
        } Rating: ${this.movie.Ratings[0].Value})`;
      }
    }
    return setMovieRating;
  };

  compileResponse = () => {
    const movieTitle = this.movie.Title;
    const movieRating = this.getMovieRatings();

    if (movieTitle) {
      if (movieRating) {
        const titleWithRating = `${movieTitle} ${movieRating}`;
        this.state.setMovie(titleWithRating);
        return `${titleWithRating} added to the film selection`;
      } else {
        this.state.setMovie(movieTitle);
        return `${movieTitle} added to the film selection`;
      }
    }

    return "Couldn't find that film";
  };

  generateResponse = async () => {
    await this.getMovie();

    if (!this.isSuccessful()) {
      this.completeResponse = "Couldn't find that film";
    } else {
      this.completeResponse = this.compileResponse();
    }

    return this.completeResponse;
  };
}
