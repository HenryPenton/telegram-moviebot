import { IncomingMessage } from "../types";
import { State } from "../State/State";
import * as messageHandler from "../messageHandler/messageHandler";
import * as movieFetcher from "../fetcher/movie/movieFetcher";
import taken from "./testData/taken.json";
import nemo from "./testData/findingnemo.json";

describe("The removies command", () => {
  let state: State;
  const mockSendMessage = jest.fn(() => {});
  const mockApi = { sendMessage: mockSendMessage };
  beforeEach(() => {
    mockSendMessage.mockReset();
  });
  const setNemoMovieMessage: IncomingMessage = {
    message: {
      from: { first_name: "Joe" },
      chat: { id: "some_chat_id" },
      text: "/setmovie findingnemo",
    },
  };
  const setTakenMovieMessage: IncomingMessage = {
    message: {
      from: { first_name: "Joe" },
      chat: { id: "some_chat_id" },
      text: "/setmovie findingnemo",
    },
  };
  const getMovieMessage: IncomingMessage = {
    message: {
      from: { first_name: "Joe" },
      chat: { id: "some_chat_id" },
      text: "/getmovies",
    },
  };
  test("should wipe the set movies", async () => {
    jest
      .spyOn(movieFetcher, "getMovie")
      .mockResolvedValueOnce(nemo)
      .mockResolvedValueOnce(taken);
    state = new State();

    const removiesMessage: IncomingMessage = {
      message: {
        from: { first_name: "Joe" },
        chat: { id: "some_chat_id" },
        text: "/removies",
      },
    };

    await messageHandler.generateResponse(setNemoMovieMessage, mockApi, state);

    expect(mockSendMessage).toHaveBeenLastCalledWith({
      chat_id: "some_chat_id",
      text: "Finding Nemo (IMDb Rating: 8.1/10) added to the film selection",
    });
    await messageHandler.generateResponse(setTakenMovieMessage, mockApi, state);

    expect(mockSendMessage).toHaveBeenLastCalledWith({
      chat_id: "some_chat_id",
      text: "Taken (IMDb Rating: 7.8/10) added to the film selection",
    });

    await messageHandler.generateResponse(getMovieMessage, mockApi, state);

    expect(mockSendMessage).toHaveBeenLastCalledWith({
      chat_id: "some_chat_id",
      text:
        "1. Finding Nemo (IMDb Rating: 8.1/10)\n2. Taken (IMDb Rating: 7.8/10)",
    });

    await messageHandler.generateResponse(removiesMessage, mockApi, state);

    expect(mockSendMessage).toHaveBeenLastCalledWith({
      chat_id: "some_chat_id",
      text: "The movie selection has been reset",
    });

    await messageHandler.generateResponse(getMovieMessage, mockApi, state);

    expect(mockSendMessage).toHaveBeenLastCalledWith({
      chat_id: "some_chat_id",
      text: "No movies have been set yet",
    });
  });
});
