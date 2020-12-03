import { ResponseType } from "../../../messageHandler/messageHandler";
import { State } from "../../../State/State";
import { LocalResponse } from "../LocalResponse";

export class RemovieResponse extends LocalResponse {
  movieToRemove: string;

  constructor(state: State, movieToRemove: string) {
    super(state);
    this.movieToRemove = movieToRemove;
  }

  generateResponse = () => {
    const movieId = parseInt(this.movieToRemove, 10);
    const unfoundResponse = `Couldn't find that film in the selection`;
    if (Number.isInteger(movieId)) {
      const removedMovie = this.state.removie(movieId);
      if (removedMovie) {
        return `${removedMovie} removed from the selection`;
      }
      return unfoundResponse;
    } else {
      return unfoundResponse;
    }
  };

  getType = () => ResponseType.message;
}
