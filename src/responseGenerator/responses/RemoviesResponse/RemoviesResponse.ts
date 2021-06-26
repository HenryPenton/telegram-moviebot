import { ResponseType } from "../../../messageHandler/messageHandler";
import { State } from "../../../State/State";
import { LocalResponse } from "../LocalResponse";

export class RemoviesResponse extends LocalResponse {
  constructor(state: State) {
    super(state);
  }

  generateResponse = (): string => {
    this.state.removies();
    this.state.resetPolls();
    return "The movie selection has been reset";
  };

  getType = (): ResponseType => ResponseType.message;
}
