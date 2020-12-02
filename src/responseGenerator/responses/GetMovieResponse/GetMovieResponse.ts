import { ResponseType } from "../../../messageHandler/messageHandler";
import { State } from "../../../State/State";
import { LocalResponse } from "../LocalResponse";

export class GetMovieResponse extends LocalResponse {
  constructor(state: State) {
    super(state);
  }

  generateResponse = () => {
    const movieSelection = this.state.getMovies();
    if (movieSelection.length === 0) {
      return "No movies have been set yet";
    } else {
      let movies = "";
      movieSelection.forEach((movie, index) => {
        if (index === 0) {
          movies = movie;
        } else {
          movies = `${movies}\n${movie}`;
        }
      });
      return movies;
    }
  };

  getType = () => ResponseType.message;
}
