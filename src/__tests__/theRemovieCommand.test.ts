import { IncomingMessage } from "../types";
import * as messageHandler from "../messageHandler/messageHandler";
import * as movieFetcher from "../fetcher/movie/movieFetcher";
import { State } from "../State/State";

import taken from "./testData/taken.json";
import nemo from "./testData/findingnemo.json";
import submarineUnrated from "./testData/submarineUnrated.json";
import nonExistingMovie from "./testData/nonExiststentFilm.json";
import movieWithoutTitle from "./testData/movieWithoutTitle.json";

describe("The get and set movie commands", () => {
  let state: State;
  const mockSendMessage = jest.fn(() => {});
  const mockApi = { sendMessage: mockSendMessage };
  beforeEach(() => {
    mockSendMessage.mockReset();
  });

  describe("The removie command", () => {
    const setMovieMessage: IncomingMessage = {
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
    test("added movies should be removeable from future calls to getmovie, remove by id", async () => {
      jest.spyOn(movieFetcher, "getMovie").mockResolvedValueOnce(nemo);
      state = new State();

      const removieMessage: IncomingMessage = {
        message: {
          from: { first_name: "Joe" },
          chat: { id: "some_chat_id" },
          text: "/removie 1",
        },
      };

      await messageHandler.generateResponse(setMovieMessage, mockApi, state);

      expect(mockSendMessage).toHaveBeenLastCalledWith({
        chat_id: "some_chat_id",
        text: "Finding Nemo (IMDb Rating: 8.1/10) added to the film selection",
      });

      await messageHandler.generateResponse(getMovieMessage, mockApi, state);

      expect(mockSendMessage).toHaveBeenLastCalledWith({
        chat_id: "some_chat_id",
        text: "1. Finding Nemo (IMDb Rating: 8.1/10)",
      });

      await messageHandler.generateResponse(removieMessage, mockApi, state);

      expect(mockSendMessage).toHaveBeenLastCalledWith({
        chat_id: "some_chat_id",
        text: "Finding Nemo (IMDb Rating: 8.1/10) removed from the selection",
      });

      await messageHandler.generateResponse(getMovieMessage, mockApi, state);

      expect(mockSendMessage).toHaveBeenLastCalledWith({
        chat_id: "some_chat_id",
        text: "No movies have been set yet",
      });
    });

    test("shouldn't remove a movie if the id is non numerical", async () => {
      jest.spyOn(movieFetcher, "getMovie").mockResolvedValueOnce(nemo);
      state = new State();

      const removieMessage: IncomingMessage = {
        message: {
          from: { first_name: "Joe" },
          chat: { id: "some_chat_id" },
          text: "/removie random_non_numerical_id",
        },
      };

      await messageHandler.generateResponse(setMovieMessage, mockApi, state);

      expect(mockSendMessage).toHaveBeenLastCalledWith({
        chat_id: "some_chat_id",
        text: "Finding Nemo (IMDb Rating: 8.1/10) added to the film selection",
      });

      await messageHandler.generateResponse(getMovieMessage, mockApi, state);

      expect(mockSendMessage).toHaveBeenLastCalledWith({
        chat_id: "some_chat_id",
        text: "1. Finding Nemo (IMDb Rating: 8.1/10)",
      });

      await messageHandler.generateResponse(removieMessage, mockApi, state);

      expect(mockSendMessage).toHaveBeenLastCalledWith({
        chat_id: "some_chat_id",
        text: "Couldn't find that film in the selection",
      });
    });

    test("shouldn't remove a movie if the id is not relateable to a film", async () => {
      jest.spyOn(movieFetcher, "getMovie").mockResolvedValueOnce(nemo);
      state = new State();

      const removieAboveLimitMessage: IncomingMessage = {
        message: {
          from: { first_name: "Joe" },
          chat: { id: "some_chat_id" },
          text: "/removie 2",
        },
      };
      const removieBelowLimitMessage: IncomingMessage = {
        message: {
          from: { first_name: "Joe" },
          chat: { id: "some_chat_id" },
          text: "/removie -1",
        },
      };

      await messageHandler.generateResponse(setMovieMessage, mockApi, state);

      expect(mockSendMessage).toHaveBeenLastCalledWith({
        chat_id: "some_chat_id",
        text: "Finding Nemo (IMDb Rating: 8.1/10) added to the film selection",
      });

      await messageHandler.generateResponse(getMovieMessage, mockApi, state);

      expect(mockSendMessage).toHaveBeenLastCalledWith({
        chat_id: "some_chat_id",
        text: "1. Finding Nemo (IMDb Rating: 8.1/10)",
      });

      await messageHandler.generateResponse(removieAboveLimitMessage, mockApi, state);

      expect(mockSendMessage).toHaveBeenLastCalledWith({
        chat_id: "some_chat_id",
        text: "Couldn't find that film in the selection",
      });

      await messageHandler.generateResponse(removieBelowLimitMessage, mockApi, state);

      expect(mockSendMessage).toHaveBeenLastCalledWith({
        chat_id: "some_chat_id",
        text: "Couldn't find that film in the selection",
      });
    });
  });
});
