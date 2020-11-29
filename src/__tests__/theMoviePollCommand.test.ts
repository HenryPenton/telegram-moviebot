import { ResponseType } from "../messageHandler/messageHandler";
import { IncomingMessage } from "../types";
import * as messageHandler from "../messageHandler/messageHandler";
import { State } from "../State/State";
import * as movieFetcher from "../fetcher/movieFetcher";
import taken from "./testData/taken.json";
import nemo from "./testData/findingnemo.json";

describe("the moviepoll command", () => {
  let state: State;

  const mockSendMessage = jest.fn(() => {});
  const mockSendPoll = jest.fn(() => {});

  const mockApi = {
    sendMessage: mockSendMessage,
    sendPoll: mockSendPoll,
  };

  beforeEach(() => {
    mockSendMessage.mockReset();
    mockSendPoll.mockReset();
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
      mockApi,
      state
    );

    expect(mockSendMessage).toHaveBeenCalledWith({
      chat_id: "some_chat_id",
      text: "You must set at least two movies to be able to send out a poll",
    });
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

    //set one film
    await messageHandler.generateResponse(
      mockSetFirstMovieStateMessage,
      mockApi,
      state
    );

    //ask for moviepoll
    await messageHandler.generateResponse(
      mockIncomingMessageOne,
      mockApi,
      state
    );

    expect(mockSendMessage).toHaveBeenCalledWith({
      chat_id: "some_chat_id",
      text: "You must set at least two movies to be able to send out a poll",
    });
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
      mockApi,
      state
    );

    await messageHandler.generateResponse(
      mockSetSecondMovieStateMessage,
      mockApi,
      state
    );

    await messageHandler.generateResponse(
      mockIncomingMessageOne,
      mockApi,
      state
    );

    expect(mockSendPoll).toHaveBeenLastCalledWith({
      allows_multiple_answers: "true",
      chat_id: "some_chat_id",
      is_anonymous: "false",
      options: [
        "Taken (IMDb Rating: 7.8/10)",
        "Finding Nemo (IMDb Rating: 8.1/10)",
      ],
      question: "New week new movies",
    });
  });
});
