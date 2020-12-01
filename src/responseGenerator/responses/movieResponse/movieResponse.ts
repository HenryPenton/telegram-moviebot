import { getMovie } from "../../../fetcher/movie/movieFetcher";
import { getTrailer } from "../../../fetcher/trailer/trailerFetcher";
import { Rating } from "../../../types";

export class MovieResponse {
  queryString: string;

  constructor(queryString: string) {
    this.queryString = queryString;
  }

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
        if (element !== "") {
          info = element;
        }
      } else if (element !== "") {
        info = `${info}\n\n${element}`;
      }
    });

    return info;
  };

  generateResponse = async () => {
    const movie = await getMovie(this.queryString);

    if (movie.Response === "False") return "Unknown movie";
    if (!movie.Title) return "Unknown movie";

    const movieDetails: string[] = [
      this.getTitleAndYear(movie.Title, movie.Year),
      this.getRuntime(movie.Runtime),
      this.getRatings(movie.Ratings),
      this.getDirector(movie.Director),
      this.getPlot(movie.Plot),
      await getTrailer(movie.Title, movie.Year),
    ];

    return this.infoAmalgamate(movieDetails);
  };
}
