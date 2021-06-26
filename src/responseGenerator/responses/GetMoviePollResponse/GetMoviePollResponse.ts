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
  isPollReady = (): boolean => this.movies.length >= 2;

  generateResponse = (): string[][] | string => {
    let response;

    if (this.pollReady) {
      response = this.movies;

      const options = [];

      for (let index = 0; index < this.movies.length; index += 10) {
        options.push(this.movies.slice(index, index + 10));
      }

      return options;
    } else {
      response =
        "You must set at least two movies to be able to send out a poll";
    }

    return response;
  };

  getType = (): ResponseType =>
    this.pollReady ? ResponseType.moviePoll : ResponseType.message;
}
