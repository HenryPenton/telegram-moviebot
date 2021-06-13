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
  setMovies: string[];

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
    this.setMovies = [];
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

  addMovie = () => {
    const movieTitle = this.movie.Title;
    const movieRating = getMovieRatings(this.movie);
    if (movieTitle) {
      this.state.setMovie(this.movie);
      if (movieRating) {
        const titleWithRating = `${movieTitle} ${movieRating}`;
        this.setMovies.push(titleWithRating);
      } else {
        this.setMovies.push(movieTitle);
      }
    }
  };
  compileResponse = () => {
    if (this.setMovies.length === 1) {
      return `${this.setMovies[0]} added to the film selection`;
    } else if (this.setMovies.length > 1) {
      let response = "";
      for (let index = 0; index < this.setMovies.length; index++) {
        const setMovie = this.setMovies[index];
        if (index === this.setMovies.length - 1) {
          response = `${response} and ${setMovie}`;
        } else if (index === 0) {
          response = setMovie;
        } else {
          response = `${response}, ${setMovie}`;
        }
      }
      response = `${response} added to the film selection`;
      return response;
    }

    return this.multiMovie
      ? "Couldn't find those films"
      : "Couldn't find that film";
  };
  generateResponse = async () => {
    if (this.multiMovie) {
      const moviesToSearchFor = this.queryString.split("%%");

      for (let index = 0; index < moviesToSearchFor.length; index++) {
        const movieToSearchFor = moviesToSearchFor[index].trim();
        this.queryString = movieToSearchFor;
        await this.getMovie();
        this.addMovie();

        this.completeResponse = this.compileResponse();
      }
    } else {
      await this.getMovie();
      this.addMovie();

      this.completeResponse = this.compileResponse();
    }
    return this.completeResponse;
  };
}
