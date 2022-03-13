import { State } from "../../../State/State";
import { LocalResponse } from "../LocalResponse";

export class RemovieResponse extends LocalResponse {
  private movieToRemove: string;
  private unfoundResponse: string;

  constructor(state: State, movieToRemove: string) {
    super(state);
    this.movieToRemove = movieToRemove.toLowerCase();
    this.unfoundResponse = "Couldn't find that film in the selection";
  }

  private removeMovie = (movieId: number): string => {
    const removedMovie = this.state.removie(movieId);
    if (removedMovie) {
      return `${removedMovie} removed from the selection`;
    }

    return this.unfoundResponse;
  };

  private matchToNameToId = (): string => {
    const currentMovies = this.state.getMovies();

    let idToRemove;

    currentMovies.forEach((movie, id) => {
      if (movie.toLowerCase().startsWith(this.movieToRemove)) {
        idToRemove = id + 1;
      }
    });

    if (!idToRemove) return this.unfoundResponse;
    return this.removeMovie(idToRemove);
  };

  generateResponse = (): string => {
    const movieId = parseInt(this.movieToRemove, 10);

    if (Number.isInteger(movieId)) {
      return this.removeMovie(movieId);
    } else {
      return this.matchToNameToId();
    }
  };
}
