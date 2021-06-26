import { commandParser } from "../commandParser/commandParser";
import { ResponseType } from "../messageHandler/messageHandler";
import { State } from "../State/State";
import { CleanupResponse } from "./responses/CleanupResponse/CleanupResponse";
import { GetMoviePollResponse } from "./responses/GetMoviePollResponse/GetMoviePollResponse";
import { GetMovieResponse } from "./responses/GetMovieResponse/GetMovieResponse";
import { GetVotesResponse } from "./responses/GetVotesResponse/GetVotesResponse";
import { MovieResponse } from "./responses/MovieResponse/MovieResponse";
import { RemovieResponse } from "./responses/RemovieResponse/RemovieResponse";
import { RemoviesResponse } from "./responses/RemoviesResponse/RemoviesResponse";
import { SetMovieResponse } from "./responses/SetMovieResponse/SetMovieResponse";

export type MessageResponse = string;

export type PollResponse = string[][];

export type Response = MessageResponse | PollResponse;

export type ResponseAndType = {
  response: Response;
  type: ResponseType;
};

export enum SearchType {
  WITH_YEAR,
  WITH_ID,
  WITH_SEARCH_TERM,
}

export const generate = async (
  messageText: string,
  state: State
): Promise<ResponseAndType> => {
  const { command, restOfString } = commandParser(messageText);
  let response: Response = "";
  let type: ResponseType = ResponseType.none;

  switch (command) {
    case Commands.movie: {
      const movieResponse = new MovieResponse(
        restOfString,
        SearchType.WITH_SEARCH_TERM
      );
      response = await movieResponse.generateResponse();
      type = movieResponse.getType();

      break;
    }
    case Commands.movieyear: {
      const movieYearResponse = new MovieResponse(
        restOfString,
        SearchType.WITH_YEAR
      );
      response = await movieYearResponse.generateResponse();

      type = movieYearResponse.getType();
      break;
    }

    case Commands.movieid: {
      const movieIdResponse = new MovieResponse(
        restOfString,
        SearchType.WITH_ID
      );
      response = await movieIdResponse.generateResponse();

      type = movieIdResponse.getType();
      break;
    }
    case Commands.setmovie: {
      const setMovieResponse = new SetMovieResponse(
        restOfString,
        state,
        SearchType.WITH_SEARCH_TERM
      );
      response = await setMovieResponse.generateResponse();
      type = setMovieResponse.getType();

      break;
    }

    case Commands.setmovieyear: {
      const setMovieYearResponse = new SetMovieResponse(
        restOfString,
        state,
        SearchType.WITH_YEAR
      );
      response = await setMovieYearResponse.generateResponse();
      type = setMovieYearResponse.getType();

      break;
    }
    case Commands.setmovieid: {
      const setMovieIdResponse = new SetMovieResponse(
        restOfString,
        state,
        SearchType.WITH_ID
      );
      response = await setMovieIdResponse.generateResponse();
      type = setMovieIdResponse.getType();

      break;
    }
    case Commands.getmovies: {
      const getMovieResponse = new GetMovieResponse(state);
      response = getMovieResponse.generateResponse();
      type = getMovieResponse.getType();

      break;
    }
    case Commands.moviepoll: {
      const getMoviePollResponse = new GetMoviePollResponse(state);
      response = getMoviePollResponse.generateResponse();
      type = getMoviePollResponse.getType();

      break;
    }
    case Commands.removie: {
      const removieResponse = new RemovieResponse(state, restOfString);
      response = removieResponse.generateResponse();
      type = removieResponse.getType();

      break;
    }
    case Commands.reset: {
      const removiesResponse = new RemoviesResponse(state);
      response = removiesResponse.generateResponse();
      type = removiesResponse.getType();

      break;
    }
    case Commands.cleanup: {
      const cleanupResponse = new CleanupResponse(state);
      response = cleanupResponse.generateResponse();
      type = cleanupResponse.getType();

      break;
    }
    case Commands.votes: {
      const voteResponse = new GetVotesResponse(state);
      response = voteResponse.generateResponse();
      type = voteResponse.getType();

      break;
    }
  }

  return { response, type };
};

export enum Commands {
  movie = "movie",
  movieyear = "movieyear",
  movieid = "movieid",
  setmovie = "setmovie",
  setmovieyear = "setmovieyear",
  setmovieid = "setmovieid",
  getmovies = "getmovies",
  moviepoll = "moviepoll",
  removie = "removie",
  reset = "reset",
  cleanup = "cleanup",
  votes = "votes",
  help = "help",
}
