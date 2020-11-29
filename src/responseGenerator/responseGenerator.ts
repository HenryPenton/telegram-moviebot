import { commandParser } from "../commandParser/commandParser";
import { ResponseType } from "../messageHandler/messageHandler";
import * as movieResponse from "../movieResponse/movieResponse";

type Response = { response: string; type: ResponseType };

export const generate = async (messageText: string): Promise<Response> => {
  const { command, restOfString } = commandParser(messageText);
  let response: string = "";
  if (command === "movie") {
    response = await movieResponse.generateResponse(restOfString);
  } else if (command === "setmovie") {
    response = `Taken added to the film selection`;
  }

  const type = ResponseType.message;
  return { response, type };
};
