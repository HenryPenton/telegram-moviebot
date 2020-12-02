import { ResponseType } from "../../../messageHandler/messageHandler";
import { State } from "../../../State/State";
import { LocalResponse } from "../LocalResponse";

export class GetMoviePollResponse extends LocalResponse {
  movies: string[];
  pollReady: boolean;

  constructor(state: State) {
    super(state);
    this.movies = state.getMovies();
    this.pollReady = this.isPollReady();
  }
  isPollReady = () => this.movies.length >= 2;

  generateResponse = () => {
    let response;

    if (this.pollReady) {
      response = this.movies;
    } else {
      response =
        "You must set at least two movies to be able to send out a poll";
    }

    return response;
  };

  getType = () =>
    this.pollReady ? ResponseType.moviePoll : ResponseType.message;
}
