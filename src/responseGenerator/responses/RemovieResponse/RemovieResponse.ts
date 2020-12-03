import { ResponseType } from "../../../messageHandler/messageHandler";
import { State } from "../../../State/State";
import { LocalResponse } from "../LocalResponse";

export class RemovieResponse extends LocalResponse {
  movieToRemove: string;

  constructor(state: State, movieToRemove: string) {
    super(state);
    this.movieToRemove = movieToRemove.toLowerCase();
  }

  matchToName = (): string => {
    const currentMovies = this.state.getMovies();
    const unfoundResponse = "Couldn't find that film in the selection";

    let idToRemove;

    currentMovies.forEach((movie, id) => {
      if (movie.toLowerCase().startsWith(this.movieToRemove)) {
        idToRemove = id + 1;
      }
    });

    if (!idToRemove) return unfoundResponse;

    const removedMovie = this.state.removie(idToRemove);
    if (removedMovie) {
      return `${removedMovie} removed from the selection`;
    }
    
    return unfoundResponse;
  };

  removeById = (movieId: number) => {
    const removedMovie = this.state.removie(movieId);
    if (removedMovie) {
      return `${removedMovie} removed from the selection`;
    }
    return `Couldn't find that film in the selection`;
  };

  generateResponse = () => {
    const movieId = parseInt(this.movieToRemove, 10);

    if (Number.isInteger(movieId)) {
      return this.removeById(movieId);
    } else {
      return this.matchToName();
    }
  };

  getType = () => ResponseType.message;
}
