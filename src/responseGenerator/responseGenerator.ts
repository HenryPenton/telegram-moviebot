import { commandParser } from "../commandParser/commandParser";
import { ResponseType } from "../messageHandler/messageHandler";
import * as movieResponse from "../movieResponse/movieResponse";
import {  State } from "../State/State";

type Response = { response: string | string[]; type: ResponseType };

export const generate = async (
  messageText: string,
  state: State
): Promise<Response> => {
  const { command, restOfString } = commandParser(messageText);
  let response: string | string[] = "";
  let type: ResponseType = ResponseType.none;
  switch (command) {
    case "movie":
      response = await movieResponse.generateResponse(restOfString);
      type = ResponseType.message;
      break;
    case "setmovie":
      state.setMovie(restOfString);
      response = `${restOfString} added to the film selection`;
      type = ResponseType.message;
      break;
    case "getmovies":
      response = state.getMovies();
      type = ResponseType.message;
      break;
    case "moviepoll":
      response = state.getMoviePoll();
      type = ResponseType.moviePoll;
      break;
  }

  return { response, type };
};
