import { SearchType } from "../../../commands";
import {
  getMovie,
  getMovieWithID,
  getMovieWithYear,
} from "../../../fetcher/movie/movieFetcher";
import { State } from "../../../State/State";
import { getMovieRatings } from "../../../utils/getMovieRatings";
import { AsyncResponse } from "../AsyncResponse";

export class SetMovieResponse extends AsyncResponse {
  movieName: string;
  state: State;
  completeResponse: string;
  searchType: SearchType;
  multiMovie: boolean;
  setMovies: string[];
  moviesToSearchFor: string[];

  constructor(queryString: string, state: State, searchType: SearchType) {
    super(queryString);

    this.state = state;
    this.completeResponse = "";
    this.movieName = queryString;
    this.searchType = searchType;
    this.moviesToSearchFor = this.queryString.split("%%");
    this.multiMovie = this.moviesToSearchFor.length > 1;
    this.setMovies = [];
  }

  private getMovie = async (): Promise<void> => {
    switch (this.searchType) {
      case SearchType.WITH_YEAR: {
        const querySplit = this.queryString.split(" ");
        const movieYear = querySplit[querySplit.length - 1];

        querySplit.pop();
        const queryStringWithoutYear = querySplit.join(" ");
        this.movie = await getMovieWithYear(queryStringWithoutYear, movieYear);
        break;
      }
      case SearchType.WITH_ID:
        this.movie = await getMovieWithID(this.queryString);
        break;

      case SearchType.WITH_SEARCH_TERM:
        this.movie = await getMovie(this.queryString);
        break;
    }
  };

  addMovie = (): void => {
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
  compileResponse = (): string => {
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

  generateResponse = async (): Promise<string> => {
    if (this.multiMovie) {
      for (let index = 0; index < this.moviesToSearchFor.length; index++) {
        const movieToSearchFor = this.moviesToSearchFor[index].trim();
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
