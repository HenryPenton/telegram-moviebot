import Fetcher from "../Fetcher/Fetcher";
import { Movie, Rating } from "../types";

export class MovieResponse {
  restOfString: string;

  constructor(restOfString: string) {
    this.restOfString = restOfString;
  }

  _getPlot(plot?: string): string {
    return plot ? `Plot: ${plot}` : "";
  }

  _getDirector(director?: string): string {
    return director ? `Director: ${director}` : "";
  }

  _getPoster(poster?: string): string {
    return poster ? `Poster: ${poster}` : "";
  }

  _getRuntime(runtime?: string): string {
    return runtime ? `Runtime: ${runtime}` : "";
  }

  _getTitleAndYear(title?: string, year?: string): string {
    if (!title) return "Unknown movie";
    const movieYear = year;
    const movieTitle = movieYear
      ? `Movie: ${title} (${year})`
      : `Movie: ${title}`;

    return movieTitle;
  }

  _getRatings(ratings?: Rating[]): string {
    let allRatings = "";
    ratings?.forEach((rating, index) => {
      allRatings = `${allRatings}${index === 0 ? "" : "\n"}${rating.Source}: ${
        rating.Value
      }`;
    });
    return allRatings;
  }

  async _getMovie() {
    return new Fetcher(
      `http://www.omdbapi.com/?t=${this.restOfString}&apikey=${process.env.MOVIE_DATABASE_KEY}`
    ).call();
  }

  async generateResponse(): Promise<string | boolean> {
    const movie = (await this._getMovie()) as Movie;
    console.log(movie);
    if (movie.Response === "False") return false;
    let info = "";

    const movieTitle = this._getTitleAndYear(movie.Title, movie.Year);
    const rating = this._getRatings(movie.Ratings);
    const movieDirector = this._getDirector(movie.Director);
    const plot = this._getPlot(movie.Plot);
    const movieRuntime = this._getRuntime(movie.Runtime);

    info = `${movieTitle}\n\n${movieRuntime}\n\n${rating}\n\n${movieDirector}\n\n${plot}`;
    return info;
  }
}
