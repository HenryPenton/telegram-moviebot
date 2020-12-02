export class State {
  movies: string[];

  constructor() {
    this.movies = [];
  }

  setMovie(movie: string): void {
    this.movies.push(movie);
  }

  getMovies(): string[] {
    return this.movies;
  }
}
