import { IncomingMessage } from "../types";

const mockSetMovieWithYearMessage: IncomingMessage = {
  message: {
    from: { first_name: "Joe" },
    chat: { id: "some_chat_id" },
    text: "/setmovieyear some_movie 2003",
  },
};

const mockMovieMessage: IncomingMessage = {
  message: {
    from: { first_name: "Joe" },
    chat: { id: "some_chat_id" },
    text: "/movie somefilmname",
  },
};

const mockMoviePollMessage: IncomingMessage = {
  message: {
    from: { first_name: "Joe" },
    chat: { id: "some_chat_id" },
    text: "/moviepoll",
  },
};

const mockSetMovieMessage: IncomingMessage = {
  message: {
    from: { first_name: "Joe" },
    chat: { id: "some_chat_id" },
    text: "/setmovie some_movie",
  },
};

const mockMovieWithYearMessage: IncomingMessage = {
  message: {
    from: { first_name: "Joe" },
    chat: { id: "some_chat_id" },
    text: "/movieyear somefilmname 1989",
  },
};

export enum MessageType {
  MOVIE = "mockMovieMessage",
  MOVIE_WITH_YEAR = "mockMovieWithYearMessage",
  SET_MOVIE = "mockSetMovieMessage",
  SET_MOVIE_WITH_YEAR = "mockSetMovieWithYearMessage",
  MOVIEPOLL = "mockMoviePollMessage",
}

export const getMessage = (messageType: MessageType) => {
  switch (messageType) {
    case MessageType.SET_MOVIE:
      return mockSetMovieMessage;
    case MessageType.SET_MOVIE_WITH_YEAR:
      return mockSetMovieWithYearMessage;
    case MessageType.MOVIE:
      return mockMovieMessage;
    case MessageType.MOVIE_WITH_YEAR:
      return mockMovieWithYearMessage;
    case MessageType.MOVIEPOLL:
      return mockMoviePollMessage;
  }
};
