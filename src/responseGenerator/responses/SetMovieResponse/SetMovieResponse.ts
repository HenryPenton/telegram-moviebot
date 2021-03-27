import {
  getMovie,
  getMovieWithID,
  getMovieWithYear,
} from "../../../fetcher/movie/movieFetcher";
import { ResponseType } from "../../../messageHandler/messageHandler";
import { State } from "../../../State/State";
import { AsyncResponse } from "../AsyncResponse";

export enum SearchType {
  WITH_YEAR,
  WITH_ID,
  WITH_SEARCH_TERM,
}
export class SetMovieResponse extends AsyncResponse {
  movieName: string;
  state: State;
  completeResponse: string;
  searchType: SearchType;

  constructor(queryString: string, state: State, searchType: SearchType) {
    super(queryString);

    this.state = state;
    this.completeResponse = "";
    this.movieName = queryString;
    this.searchType = searchType;
  }
  getMovie = async () => {
    switch (this.searchType) {
      case SearchType.WITH_YEAR:
        const querySplit = this.queryString.split(" ");
        const movieYear = querySplit[querySplit.length - 1];

        querySplit.pop();
        const queryStringWithoutYear = querySplit.join(" ");
        this.movie = await getMovieWithYear(queryStringWithoutYear, movieYear);
        break;
      case SearchType.WITH_ID:
        this.movie = await getMovieWithID(this.queryString);
        break;
      case SearchType.WITH_SEARCH_TERM:
        this.movie = await getMovie(this.queryString);
        break;
    }
  };

  getType = () => ResponseType.message;

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
    if (this.state.movies.length === 10) {
      return "You may only set up to 10 movies";
    }
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
