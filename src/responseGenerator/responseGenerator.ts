import { commandParser } from "../commandParser/commandParser";
import { ResponseType } from "../messageHandler/messageHandler";
import * as movieResponse from "./responses/MovieResponse/MovieResponse";
import * as setMovieResponse from "./responses/SetMovieResponse/SetMovieResponse";
import { State } from "../State/State";
import { MovieResponse } from "./responses/MovieResponse/MovieResponse";
import { SetMovieResponse } from "./responses/SetMovieResponse/SetMovieResponse";

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
      const movieResponse = new MovieResponse(restOfString);
      response = await movieResponse.generateResponse();
      type = movieResponse.getType();
      break;
    case "setmovie":
      const setMovieResponse = new SetMovieResponse(restOfString, state);
      response = await setMovieResponse.generateResponse();

      type = setMovieResponse.getType();

      break;
    case "getmovies":
      response = state.getMovies();
      type = ResponseType.message;
      break;
    case "moviepoll":
      response = state.getMoviePoll();
      type = state.canPoll() ? ResponseType.moviePoll : ResponseType.message;
      break;
  }

  return { response, type };
};
