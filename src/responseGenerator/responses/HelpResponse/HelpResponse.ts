import { ResponseType } from "../../../messageHandler/messageHandler";
import { State } from "../../../State/State";
import { LocalResponse } from "../LocalResponse";

export type HelpDefinitions = { [key: string]: string };

export class HelpResponse extends LocalResponse {
  helpDefinitions: HelpDefinitions;
  commands: string[];

  constructor(
    state: State,
    helpDefinitions: HelpDefinitions,
    commands: string[]
  ) {
    super(state);
    this.helpDefinitions = helpDefinitions;
    this.commands = commands;
  }

  generateResponse = (): string => {
    let response = "";

    for (let index = 0; index < this.commands.length; index++) {
      const command = this.commands[index];
      response = `${response}\n${command}: ${this.helpDefinitions[command]}`;
    }
    return response;
  };

  getType = (): ResponseType => ResponseType.message;
}
