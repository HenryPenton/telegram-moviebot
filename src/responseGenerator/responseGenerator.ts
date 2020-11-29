import { commandParser } from "../commandParser/commandParser";
import { ResponseType } from "../messageHandler/messageHandler";
import * as movieResponse from "../movieResponse/movieResponse";
import * as setMovieResponse from "../setMovieResponse/setMovieResponse";
import { State } from "../State/State";

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
      const {
        setMovieTitle,
        completeResponse,
        successfulRequest,
        setMovieRating,
      } = await setMovieResponse.generateResponse(restOfString);
      if (successfulRequest) {
        if (setMovieTitle) {
          if (setMovieRating) {
            const titleWithRating = `${setMovieTitle} ${setMovieRating}`;
            state.setMovie(titleWithRating);
          } else {
            state.setMovie(setMovieTitle);
          }

          response = completeResponse;
        }
      } else {
        response = "Couldn't find that film";
      }
      type = ResponseType.message;
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
