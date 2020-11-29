import { commandParser } from "../commandParser/commandParser";
import { ResponseType } from "../messageHandler/messageHandler";
import * as movieResponse from "../movieResponse/movieResponse";
import { State } from "../State/State";

type Response = { response: string; type: ResponseType };

export const generate = async (
  messageText: string,
  state: State
): Promise<Response> => {
  const { command, restOfString } = commandParser(messageText);
  let response: string = "";
  switch (command) {
    case "movie":
      response = await movieResponse.generateResponse(restOfString);
      break;
    case "setmovie":
      response = `Taken added to the film selection`;
      break;
    case "getmovies":
      response = state.getMovies();
      break;
  }

  const type = ResponseType.message;
  return { response, type };
};
