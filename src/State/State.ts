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

  removie(id: number): string {
    const zeroizedId = id - 1;
    const movieName = this.movies[id - 1];
    const newMovieArray = this.movies.filter(
      (_, index) => index !== zeroizedId
    );
    this.movies = newMovieArray;

    return movieName;
  }
}
