import { SearchType } from "../../../commands";
import {
  getMovie,
  getMovieWithID,
  getMovieWithYear,
  Rating,
} from "../../../fetcher/movie/movieFetcher";
import { getTrailer } from "../../../fetcher/trailer/trailerFetcher";
import {
  AsyncResponse,
  MovieAndYearNotProvidedError,
  MovieIDNotProvided,
  MovieNotProvidedError,
} from "../AsyncResponse";

export class MovieResponse extends AsyncResponse {
  searchType: SearchType;

  constructor(queryString: string, searchType: SearchType) {
    super(queryString);
    this.queryString = queryString;
    this.searchType = searchType;
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

  private getPlot = (plot?: string): string => (plot ? `Plot: ${plot}` : "");

  private getDirector = (director?: string): string =>
    director ? `Director: ${director}` : "";

  private getRuntime = (runtime?: string): string =>
    runtime ? `Runtime: ${runtime}` : "";

  private getTitleAndYear = (title?: string, year?: string): string => {
    const movieYear = year;
    const movieTitle = movieYear
      ? `Movie: ${title} (${year})`
      : `Movie: ${title}`;

    return movieTitle;
  };

  private getRatings = (ratings?: Rating[]): string => {
    let allRatings = "";
    if (ratings) {
      ratings.forEach((rating, index) => {
        allRatings = `${allRatings}${index === 0 ? "" : "\n"}${
          rating.Source
        }: ${rating.Value}`;
      });
    }
    return allRatings;
  };

  private combineKnownInformation = (infoArray: string[]): string => {
    let info = "";
    infoArray.forEach((element, index) => {
      if (index === 0) {
        info = element;
      } else if (element !== "") {
        info = `${info}\n\n${element}`;
      }
    });

    return info;
  };

  generateResponse = async (): Promise<string> => {
    try {
      const movie = await this.getMovie();

      if (movie.Response === "False" || movie.Title === undefined)
        return "Unknown movie";

      const titleAndYear = this.getTitleAndYear(movie.Title, movie.Year);

      const movieDetails: string[] = [
        titleAndYear,
        this.getRuntime(movie.Runtime),
        this.getRatings(movie.Ratings),
        this.getDirector(movie.Director),
        this.getPlot(movie.Plot),
        await getTrailer(titleAndYear),
      ];

      return this.combineKnownInformation(movieDetails);
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
