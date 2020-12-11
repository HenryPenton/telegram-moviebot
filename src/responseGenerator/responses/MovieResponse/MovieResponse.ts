import { getMovie } from "../../../fetcher/movie/movieFetcher";
import { getTrailer } from "../../../fetcher/trailer/trailerFetcher";
import { ResponseType } from "../../../messageHandler/messageHandler";
import { Rating } from "../../../types";
import { AsyncResponse } from "../AsyncResponse";

export class MovieResponse extends AsyncResponse {
  constructor(queryString: string) {
    super(queryString);
    this.queryString = queryString;
  }

  getMovie = async () => {
    this.movie = await getMovie(this.queryString);
  };

  getType = () => ResponseType.message;

  getPlot = (plot?: string): string => (plot ? `Plot: ${plot}` : "");

  getDirector = (director?: string): string =>
    director ? `Director: ${director}` : "";

  getRuntime = (runtime?: string): string =>
    runtime ? `Runtime: ${runtime}` : "";

  getTitleAndYear = (title?: string, year?: string): string => {
    if (!title) return "Unknown movie";
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

    if (this.movie.Response === "False") return "Unknown movie";

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
