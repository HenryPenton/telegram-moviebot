import { ResponseType } from "../../../messageHandler/messageHandler";
import { State } from "../../../State/State";
import { LocalResponse } from "../LocalResponse";

export class GetMoviePollResponse extends LocalResponse {
  movies: string[];
  pollReady: boolean;
  maxPollLength: number;
  minPollLength: number;

  constructor(state: State) {
    super(state);
    state.makeUnique();
    this.movies = state.getMovies();
    this.pollReady = this.isPollReady();
    this.maxPollLength = 10;
    this.minPollLength = 9;
  }
  isPollReady = (): boolean => this.movies.length >= 2;

  generateResponse = (): string[][] | string => {
    let response;

    if (this.pollReady) {
      response = this.movies;

      const options = [];
      
      const remainder = this.movies.length % 10;
      const remainderIsOne = remainder === 1;

      const pollSize = remainderIsOne ? this.minPollLength : this.maxPollLength;

      for (let index = 0; index < this.movies.length; index += pollSize) {
        options.push(this.movies.slice(index, index + pollSize));
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
