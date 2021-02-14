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

export enum MessageType {
  MOVIE = "mockMovieMessage",
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
    case MessageType.MOVIEPOLL:
      return mockMoviePollMessage;
  }
};
