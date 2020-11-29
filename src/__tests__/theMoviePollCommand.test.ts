import { ResponseType } from "../messageHandler/messageHandler";
import { IncomingMessage } from "../types";
import * as messageHandler from "../messageHandler/messageHandler";
import { State } from "../State/State";
import * as movieFetcher from "../fetcher/movieFetcher";
import taken from "./testData/taken.json";
import nemo from "./testData/findingnemo.json";

describe("the moviepoll command", () => {
  let state: State;

  const mockSendMessage = jest.fn();
  jest.spyOn(messageHandler, "respond").mockImplementation(mockSendMessage);
  beforeEach(() => {
    mockSendMessage.mockReset();
  });

  const mockSetFirstMovieStateMessage: IncomingMessage = {
    message: {
      from: { first_name: "Joe" },
      chat: { id: "some_chat_id" },
      text: "/setmovie Taken",
    },
  };
  const mockSetSecondMovieStateMessage: IncomingMessage = {
    message: {
      from: { first_name: "Joe" },
      chat: { id: "some_chat_id" },
      text: "/setmovie Finding nemo",
    },
  };

  test("Should send a message informing users that at least two movies have to be set before a poll can be sent out IF there are no movies set", async () => {
    state = new State();

    const mockIncomingMessageOne: IncomingMessage = {
      message: {
        from: { first_name: "Joe" },
        chat: { id: "some_chat_id" },
        text: "/moviepoll",
      },
    };

    const mockResponseOne: string =
      "You must set at least two movies to be able to send out a poll";

    await messageHandler.generateResponse(
      mockIncomingMessageOne,
      "fake api",
      state
    );

    expect(mockSendMessage).toHaveBeenCalledWith(
      mockResponseOne,
      "some_chat_id",
      ResponseType.message,
      "fake api"
    );
  });

  test("Should send a message informing users that at least two movies have to be set before a poll can be sent out IF there is one movie set", async () => {
    state = new State();

    const mockIncomingMessageOne: IncomingMessage = {
      message: {
        from: { first_name: "Joe" },
        chat: { id: "some_chat_id" },
        text: "/moviepoll",
      },
    };

    const mockResponseOne: string =
      "You must set at least two movies to be able to send out a poll";

    await messageHandler.generateResponse(
      mockSetFirstMovieStateMessage,
      "fake api",
      state
    );
    await messageHandler.generateResponse(
      mockIncomingMessageOne,
      "fake api",
      state
    );

    expect(mockSendMessage).toHaveBeenCalledWith(
      mockResponseOne,
      "some_chat_id",
      ResponseType.message,
      "fake api"
    );
  });

  test("Should send a moviepoll out if there are two or more movies set", async () => {
    state = new State();

    const mockIncomingMessageOne: IncomingMessage = {
      message: {
        from: { first_name: "Joe" },
        chat: { id: "some_chat_id" },
        text: "/moviepoll",
      },
    };
    jest
      .spyOn(movieFetcher, "getMovie")
      .mockResolvedValueOnce(taken)
      .mockResolvedValueOnce(nemo);

    await messageHandler.generateResponse(
      mockSetFirstMovieStateMessage,
      "fake api",
      state
    );

    await messageHandler.generateResponse(
      mockSetSecondMovieStateMessage,
      "fake api",
      state
    );

    await messageHandler.generateResponse(
      mockIncomingMessageOne,
      "fake api",
      state
    );

    expect(mockSendMessage).toHaveBeenLastCalledWith(
      ["Taken (IMDb Rating: 7.8/10)", "Finding Nemo (IMDb Rating: 8.1/10)"],
      "some_chat_id",
      ResponseType.moviePoll,
      "fake api"
    );
  });
});
