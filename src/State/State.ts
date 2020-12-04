export class State {
  movies: string[];

  constructor() {
    this.movies = [];
  }

  setMovie = (movie: string) => this.movies.push(movie);

  getMovies = (): string[] => this.movies;

  removies = () => (this.movies = []);

  removie = (id: number): string => {
    const zeroizedId = id - 1;
    const movieName = this.movies[zeroizedId];

    const newMovieArray = this.movies.filter(
      (_, index) => index !== zeroizedId
    );
    this.movies = newMovieArray;

    return movieName;
  };
}
