export class State {
  movies: string[];

  constructor() {
    this.movies = [];
  }

  setMovie(movie: string): void {
    this.movies.push(movie);
  }

  getMoviePoll(): string | string[] {
    return !this.canPoll()
      ? "You must set at least two movies to be able to send out a poll"
      : this.movies;
  }

  canPoll() {
    return this.movies.length >= 2;
  }

  getMovies(): string {
    if (this.movies.length === 0) {
      return "No movies have been set yet";
    } else {
      let movies = "";
      this.movies.forEach((movie, index) => {
        if (index === 0) {
          movies = movie;
        } else {
          movies = `${movies}\n${movie}`;
        }
      });
      return movies;
    }
  }
}
