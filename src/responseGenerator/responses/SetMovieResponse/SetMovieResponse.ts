import { SearchType } from "../../../commands";
import {
  getMovie,
  getMovieWithID,
  getMovieWithYear,
} from "../../../fetcher/movie/movieFetcher";
import { State } from "../../../State/State";
import { getMovieRatings } from "../../../utils/getMovieRatings";
import {
  AsyncMovieResponse,
  MovieAndYearNotProvidedError,
  MovieIDNotProvided,
  MovieNotProvidedError,
} from "../AsyncMovieResponse";

export class SetMovieResponse extends AsyncMovieResponse {
  movieName: string;
  state: State;
  completeResponse: string;
  searchType: SearchType;
  multiMovie: boolean;
  processedMovies: string[];
  moviesToSearchFor: string[];

  constructor(queryString: string, state: State, searchType: SearchType) {
    super(queryString);

    this.state = state;
    this.completeResponse = "";
    this.movieName = queryString;
    this.searchType = searchType;
    this.moviesToSearchFor = this.queryString.split("%%");
    this.multiMovie = this.moviesToSearchFor.length > 1;
    this.processedMovies = [];
  }

  private getMovie = async () => {
    switch (this.searchType) {
      case SearchType.WITH_YEAR: {
        if (this.queryString === "") throw new MovieAndYearNotProvidedError();

        const querySplit = this.queryString.split(" ");
        const movieYear = querySplit[querySplit.length - 1];

        querySplit.pop();
        const queryStringWithoutYear = querySplit.join(" ");
        return getMovieWithYear(queryStringWithoutYear, movieYear);
      }
      case SearchType.WITH_ID:
        if (this.queryString === "") throw new MovieIDNotProvided();
        return getMovieWithID(this.queryString);

      case SearchType.WITH_SEARCH_TERM:
        if (this.queryString === "") throw new MovieNotProvidedError();
        return getMovie(this.queryString);
    }
  };

  addMovieToState = (): void => {
    const movieTitle = this.movie.Title;
    const movieRating = getMovieRatings(this.movie);
    if (movieTitle) {
      this.state.setMovie(this.movie);
      if (movieRating) {
        const titleWithRating = `${movieTitle} ${movieRating}`;
        this.processedMovies.push(titleWithRating);
      } else {
        this.processedMovies.push(movieTitle);
      }
    }
  };

  compileResponse = (): string => {
    if (this.processedMovies.length === 1) {
      return `${this.processedMovies[0]} added to the film selection`;
    } else if (this.processedMovies.length > 1) {
      let response = "";
      for (let index = 0; index < this.processedMovies.length; index++) {
        const setMovie = this.processedMovies[index];
        if (index === this.processedMovies.length - 1) {
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

  generateResponse = async (): Promise<string> => {
    try {
      if (this.multiMovie) {
        for (let index = 0; index < this.moviesToSearchFor.length; index++) {
          const movieToSearchFor = this.moviesToSearchFor[index].trim();
          this.queryString = movieToSearchFor;
          this.movie = await this.getMovie();
          this.addMovieToState();

          this.completeResponse = this.compileResponse();
        }
      } else {
        this.movie = await this.getMovie();

        this.addMovieToState();

        this.completeResponse = this.compileResponse();
      }
      return this.completeResponse;
    } catch (e) {
      return this.generateErrorReponse(e);
    }
  };
}
