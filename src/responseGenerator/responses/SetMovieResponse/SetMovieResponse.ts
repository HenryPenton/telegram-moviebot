import { SearchType } from "../../../commands";
import {
  getMovie,
  getMovieWithID,
  getMovieWithYear,
} from "../../../fetcher/movie/movieFetcher";
import { State } from "../../../State/State";
import { getMovieRatings } from "../../../utils/getMovieRatings";
import {
  AsyncResponse,
  MovieAndYearNotProvidedError,
  MovieIDNotProvided,
  MovieNotProvidedError,
} from "../AsyncResponse";

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
    try {
      if (this.multiMovie) {
        for (let index = 0; index < this.moviesToSearchFor.length; index++) {
          const movieToSearchFor = this.moviesToSearchFor[index].trim();
          this.queryString = movieToSearchFor;
          this.movie = await this.getMovie();
          this.addMovie();

          this.completeResponse = this.compileResponse();
        }
      } else {
        this.movie = await this.getMovie();

        this.addMovie();

        this.completeResponse = this.compileResponse();
      }
      return this.completeResponse;
    } catch (e) {
      return this.generateErrorReponse(e);
    }
  };

  private generateErrorReponse = (e: unknown) => {
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
