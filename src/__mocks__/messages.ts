import { IncomingMessage } from "../types";

const mockSetMovieWithYearMessage: IncomingMessage = {
  message: {
    from: { first_name: "Joe" },
    chat: { id: "some_chat_id" },
    text: "/setmovieyear some_movie 2003",
  },
};

const mockSetMovieWithIdMessage: IncomingMessage = {
  message: {
    from: { first_name: "Joe" },
    chat: { id: "some_chat_id" },
    text: "/setmovieid tt0103644",
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

const mockMovieWithIdMessage: IncomingMessage = {
  message: {
    from: { first_name: "Joe" },
    chat: { id: "some_chat_id" },
    text: "/movieid ttsomeid",
  },
};

const mockRegularMessage: IncomingMessage = {
  message: {
    from: { first_name: "Joe" },
    chat: { id: "some_chat_id" },
    text: "dontknowthiscommand",
  },
};

const noChatIDMessage: IncomingMessage = {
  message: {
    from: { first_name: "Joe" },
    chat: {},
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

const cleanupMessage: IncomingMessage = {
  message: {
    from: { first_name: "Joe" },
    chat: { id: "some_chat_id" },
    text: "/cleanup",
  },
};

const setMultiMovieMessage: IncomingMessage = {
  message: {
    from: { first_name: "Joe" },
    chat: { id: "some_chat_id" },
    text: "/setmovie movie one%%movie two",
  },
};
const setThreeMultiMovieMessage: IncomingMessage = {
  message: {
    from: { first_name: "Joe" },
    chat: { id: "some_chat_id" },
    text: "/setmovie movie one%%movie two%%moviethree",
  },
};
const moviePollVote: IncomingMessage = {
  poll_answer: {
    poll_id: "12345",
    user: {
      username: "HenryPenton",
    },
    option_ids: [0],
  },
};

export enum MessageType {
  MOVIE,
  MOVIE_WITH_YEAR,
  MOVIE_WITH_ID,
  SET_MOVIE,
  SET_MOVIE_WITH_YEAR,
  SET_MOVIE_WITH_ID,
  SET_MULTI_MOVIE,
  SET_THREE_MULTI_MOVIE,
  SET_TWO_MULTI_MOVIE_ONE_FAILURE,
  MOVIEPOLL,
  MOVIEPOLL_WITH_RESPONSE,
  REMOVIE,
  UNKNOWN_COMMAND,
  NON_EXISTSTENT_COMMAND,
  NO_CHAT_ID,
  CLEANUP,
  MOVIEPOLL_VOTE,
}

export const getMessage = (messageType: MessageType) => {
  switch (messageType) {
    case MessageType.SET_MOVIE:
      return mockSetMovieMessage;
    case MessageType.SET_MOVIE_WITH_YEAR:
      return mockSetMovieWithYearMessage;
    case MessageType.MOVIE_WITH_ID:
      return mockMovieWithIdMessage;
    case MessageType.MOVIE:
      return mockMovieMessage;
    case MessageType.MOVIE_WITH_YEAR:
      return mockMovieWithYearMessage;
    case MessageType.MOVIEPOLL:
      return mockMoviePollMessage;
    case MessageType.MOVIEPOLL_WITH_RESPONSE:
      return mockMoviePollMessage;
    case MessageType.UNKNOWN_COMMAND:
      return mockRegularMessage;
    case MessageType.NON_EXISTSTENT_COMMAND:
      return mockNonExistentCommandMessage;
    case MessageType.SET_MOVIE_WITH_ID:
      return mockSetMovieWithIdMessage;
    case MessageType.NO_CHAT_ID:
      return noChatIDMessage;
    case MessageType.CLEANUP:
      return cleanupMessage;
    case MessageType.SET_MULTI_MOVIE:
      return setMultiMovieMessage;
    case MessageType.SET_THREE_MULTI_MOVIE:
      return setThreeMultiMovieMessage;
    case MessageType.SET_TWO_MULTI_MOVIE_ONE_FAILURE:
      return setThreeMultiMovieMessage;
    case MessageType.MOVIEPOLL_VOTE:
      return moviePollVote;
  }
};
