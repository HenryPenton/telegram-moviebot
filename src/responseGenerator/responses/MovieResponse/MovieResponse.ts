import {
  getMovie,
  getMovieWithID,
  getMovieWithYear,
} from "../../../fetcher/movie/movieFetcher";
import { getTrailer } from "../../../fetcher/trailer/trailerFetcher";
import { ResponseType } from "../../../messageHandler/messageHandler";
import { Rating } from "../../../types";
import { SearchType } from "../../responseGenerator";
import { AsyncResponse } from "../AsyncResponse";

export class MovieResponse extends AsyncResponse {
  searchType: SearchType;

  constructor(queryString: string, searchType: SearchType) {
    super(queryString);
    this.queryString = queryString;
    this.searchType = searchType;
  }

  getMovie = async (): Promise<void> => {
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

  getType = (): ResponseType => ResponseType.message;

  getPlot = (plot?: string): string => (plot ? `Plot: ${plot}` : "");

  getDirector = (director?: string): string =>
    director ? `Director: ${director}` : "";

  getRuntime = (runtime?: string): string =>
    runtime ? `Runtime: ${runtime}` : "";

  getTitleAndYear = (title?: string, year?: string): string => {
    const movieYear = year;
    const movieTitle = movieYear
      ? `Movie: ${title} (${year})`
      : `Movie: ${title}`;

    return movieTitle;
  };

  getRatings = (ratings?: Rating[]): string => {
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

  infoAmalgamate = (infoArray: string[]): string => {
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
    await this.getMovie();

    if (this.movie.Response === "False" || this.movie.Title === undefined)
      return "Unknown movie";

    const titleAndYear = this.getTitleAndYear(
      this.movie.Title,
      this.movie.Year
    );

    const movieDetails: string[] = [
      titleAndYear,
      this.getRuntime(this.movie.Runtime),
      this.getRatings(this.movie.Ratings),
      this.getDirector(this.movie.Director),
      this.getPlot(this.movie.Plot),
      await getTrailer(titleAndYear),
    ];

    return this.infoAmalgamate(movieDetails);
  };
}
