import {
  getMovie,
  getMovieWithYear,
} from "../../../fetcher/movie/movieFetcher";
import { getTrailer } from "../../../fetcher/trailer/trailerFetcher";
import { ResponseType } from "../../../messageHandler/messageHandler";
import { Rating } from "../../../types";
import { AsyncResponse } from "../AsyncResponse";

export class MovieResponse extends AsyncResponse {
  withYear: boolean;

  constructor(queryString: string, withYear: boolean = false) {
    super(queryString);
    this.queryString = queryString;
    this.withYear = withYear;
  }

  getMovie = async () => {
    if (this.withYear) {
      const querySplit = this.queryString.split(" ");
      const movieYear = querySplit[querySplit.length - 1];

      querySplit.pop();
      const queryStringWithoutYear = querySplit.join(" ");
      this.movie = await getMovieWithYear(queryStringWithoutYear, movieYear);
    } else {
      this.movie = await getMovie(this.queryString);
    }
  };

  getType = () => ResponseType.message;

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

  infoAmalgamate = (infoArray: any[]) => {
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

  generateResponse = async () => {
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
