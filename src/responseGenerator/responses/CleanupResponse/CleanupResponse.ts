import { ResponseType } from "../../../messageHandler/messageHandler";
import { State } from "../../../State/State";
import { LocalResponse } from "../LocalResponse";

export class CleanupResponse extends LocalResponse {
  constructor(state: State) {
    super(state);
  }

  generateResponse = () => {
    this.state.makeUnique();
    return "Duplicates in the movie selection have been removed";
  };

  getType = () => ResponseType.message;
}