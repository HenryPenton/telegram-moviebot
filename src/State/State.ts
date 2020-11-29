export class State {
  movies: { name: string }[];

  constructor() {
    this.movies = [];
  }

  getMovies() {
    if (this.movies.length === 0) {
      return "No movies have been set yet";
    } else {
      let movies = "";
      this.movies.forEach((movie, index) => {
        if (index === 0) {
          movies = movie.name;
        } else {
          movies = `${movies}, ${movie.name}`;
        }
      });
      return movies;
    }
  }
}
