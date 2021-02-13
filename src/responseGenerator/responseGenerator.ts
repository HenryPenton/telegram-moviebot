import { commandParser } from "../commandParser/commandParser";
import { ResponseType } from "../messageHandler/messageHandler";
import { State } from "../State/State";
import { GetMoviePollResponse } from "./responses/GetMoviePollResponse/GetMoviePollResponse";
import { GetMovieResponse } from "./responses/GetMovieResponse/GetMovieResponse";
import { MovieResponse } from "./responses/MovieResponse/MovieResponse";
import { MovieYearResponse } from "./responses/MovieYearResponse/MovieYearResponse";
import { RemovieResponse } from "./responses/RemovieResponse/RemovieResponse";
import { RemoviesResponse } from "./responses/RemoviesResponse/RemoviesResponse";
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
    case "movieyear":
      const movieYearResponse = new MovieYearResponse(restOfString);
      response = await movieYearResponse.generateResponse();

      type = movieYearResponse.getType();
      break;
    case "setmovie":
      const setMovieResponse = new SetMovieResponse(restOfString, state);
      response = await setMovieResponse.generateResponse();
      type = setMovieResponse.getType();

      break;
    case "getmovies":
      const getMovieResponse = new GetMovieResponse(state);
      response = getMovieResponse.generateResponse();
      type = getMovieResponse.getType();

      break;
    case "moviepoll":
      const getMoviePollResponse = new GetMoviePollResponse(state);
      response = getMoviePollResponse.generateResponse();
      type = getMoviePollResponse.getType();

      break;
    case "removie":
      const removieResponse = new RemovieResponse(state, restOfString);
      response = removieResponse.generateResponse();
      type = removieResponse.getType();

      break;
    case "removies":
      const removiesResponse = new RemoviesResponse(state);
      response = removiesResponse.generateResponse();
      type = removiesResponse.getType();

      break;
  }

  return { response, type };
};
