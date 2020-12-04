import { getMovie } from "../../../fetcher/movie/movieFetcher";
import { ResponseType } from "../../../messageHandler/messageHandler";
import { State } from "../../../State/State";
import { AsyncResponse } from "../AsyncResponse";

export class SetMovieResponse extends AsyncResponse {
  movieName: string;
  state: State;
  completeResponse: string;

  constructor(queryString: string, state: State) {
    super(queryString);

    this.state = state;
    this.completeResponse = "";
    this.movieName = queryString;
  }
  getMovie = async () => {
    this.movie = await getMovie(this.queryString);
  };

  getType = () => ResponseType.message;

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
