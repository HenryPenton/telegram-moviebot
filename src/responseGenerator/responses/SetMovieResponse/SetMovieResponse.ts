import {
  getMovie,
  getMovieWithID,
  getMovieWithYear,
} from "../../../fetcher/movie/movieFetcher";
import { ResponseType } from "../../../messageHandler/messageHandler";
import { State } from "../../../State/State";
import { getMovieRatings } from "../../../utils/getMovieRatings";
import { SearchType } from "../../responseGenerator";
import { AsyncResponse } from "../AsyncResponse";

export class SetMovieResponse extends AsyncResponse {
  movieName: string;
  state: State;
  completeResponse: string;
  searchType: SearchType;
  multiMovie: boolean;

  constructor(
    queryString: string,
    state: State,
    searchType: SearchType,
    multiMovie = false
  ) {
    super(queryString);

    this.state = state;
    this.completeResponse = "";
    this.movieName = queryString;
    this.searchType = searchType;
    this.multiMovie = multiMovie;
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

  compileResponse = () => {
    const movieTitle = this.movie.Title;
    const movieRating = getMovieRatings(this.movie);
    if (movieTitle) {
      if (movieRating) {
        const titleWithRating = `${movieTitle} ${movieRating}`;
        this.state.setMovie(this.movie);
        return titleWithRating;
      } else {
        this.state.setMovie(this.movie);
        return movieTitle;
      }
    }
  };

  generateResponse = async () => {
    if (this.multiMovie) {
      const moviesToSearchFor = this.queryString.split("%%");

      for (let index = 0; index < moviesToSearchFor.length; index++) {
        const movieToSearchFor = moviesToSearchFor[index];
        this.queryString = movieToSearchFor;
        await this.getMovie();
        const compiledResponse = this.compileResponse();

        // if (this.isSuccessful()) {
          this.completeResponse = `${this.completeResponse}${
            index !== 0 ? " and " : ""
          }${compiledResponse}`;
        // }
      }
      this.completeResponse = `${this.completeResponse} added to the film selection`;
    } else {
      await this.getMovie();
      const compiledResponse = this.compileResponse();
      if (this.isSuccessful() && compiledResponse) {
        this.completeResponse = `${compiledResponse} added to the film selection`;
      } else {
        this.completeResponse = "Couldn't find that film";
      }
    }
    return this.completeResponse;
  };
}
