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

const mockRegularMessage: IncomingMessage = {
  message: {
    from: { first_name: "Joe" },
    chat: { id: "some_chat_id" },
    text: "dontknowthiscommand",
  },
};

const mockNonExistentCommandMessage: IncomingMessage = {
  message: {
    from: { first_name: "Joe" },
    chat: { id: "some_chat_id" },
    text: "/dontknowthiscommand",
  },
};

export enum MessageType {
  MOVIE,
  MOVIE_WITH_YEAR,
  SET_MOVIE,
  SET_MOVIE_WITH_YEAR,
  MOVIEPOLL,
  REMOVIE,
  UNKNOWN_COMMAND,
  NON_EXISTSTENT_COMMAND
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
    case MessageType.UNKNOWN_COMMAND:
      return mockRegularMessage;
    case MessageType.NON_EXISTSTENT_COMMAND:
      return mockNonExistentCommandMessage;
  }
};
