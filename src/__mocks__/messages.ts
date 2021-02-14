import { IncomingMessage } from "../types";

const mockSetMovieWithYearMessage: IncomingMessage = {
  message: {
    from: { first_name: "Joe" },
    chat: { id: "some_chat_id" },
    text: "/setmovieyear some_movie 2003",
  },
};

export enum MessageType {
  SET_MOVIE_WITH_YEAR = "mockSetMovieWithYear",
}

export const getMessage = (messageType: MessageType) => {
  switch (messageType) {
    case MessageType.SET_MOVIE_WITH_YEAR:
      return mockSetMovieWithYearMessage;
  }
};
