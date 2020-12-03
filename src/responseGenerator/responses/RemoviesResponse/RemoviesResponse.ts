import { ResponseType } from "../../../messageHandler/messageHandler";
import { State } from "../../../State/State";
import { LocalResponse } from "../LocalResponse";

export class RemoviesResponse extends LocalResponse {
  constructor(state: State) {
    super(state);
  }

  generateResponse = () => {
    this.state.removies();
    return "The movie selection has been reset";
  };

  getType = () => ResponseType.message;
}
