import { Movie } from "../types";
import { getMovieRatings } from "../utils/getMovieRatings";

export class State {
  movies: Movie[];

  constructor() {
    this.movies = [];
  }

  setMovie = (movie: Movie) => this.movies.push(movie);

  getMovies = (): string[] => {
    return this.movies.map(
      (movie) =>
        `${
          movie.Ratings
            ? `${movie.Title} ${getMovieRatings(movie)}`
            : movie.Title
        }`
    );
  };

  removies = () => (this.movies = []);

  removie = (id: number): string | undefined => {
    const zeroizedId = id - 1;
    const movie = this.movies[zeroizedId];

    const newMovieArray = this.movies.filter(
      (_, index) => index !== zeroizedId
    );
    this.movies = newMovieArray;
    if (!movie) {
      return undefined;
    }
    return movie.Title;
  };

  makeUnique = () => {
    const newbadboi = Array.from(new Set(this.movies));

    this.movies = newbadboi;
  };
}
