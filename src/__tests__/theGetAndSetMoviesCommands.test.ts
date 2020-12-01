import { IncomingMessage } from "../types";
import * as messageHandler from "../messageHandler/messageHandler";
import * as movieFetcher from "../fetcher/movie/movieFetcher";
import { State } from "../State/State";

import taken from "./testData/taken.json";
import nemo from "./testData/findingnemo.json";
import nonExistingMovie from "./testData/nonExiststentFilm.json";

describe("The get and set movie commands", () => {
  let state: State;
  const mockSendMessage = jest.fn(() => {});
  const mockApi = { sendMessage: mockSendMessage };
  beforeEach(() => {
    mockSendMessage.mockReset();
  });

  describe("The setmovie command", () => {
    test("should fire a message with the film name (returned from the database) when someone sets a movie", async () => {
      jest.spyOn(movieFetcher, "getMovie").mockResolvedValueOnce(nemo);
      state = new State();

      const mockIncomingMessageOne: IncomingMessage = {
        message: {
          from: { first_name: "Joe" },
          chat: { id: "some_chat_id" },
          text: "/setmovie finding nemo",
        },
      };

      await messageHandler.generateResponse(
        mockIncomingMessageOne,
        mockApi,
        state
      );

      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: "Finding Nemo added to the film selection",
      });
    });

    test("should not set a movie if it doesn't exist in the database", async () => {
      jest
        .spyOn(movieFetcher, "getMovie")
        .mockResolvedValueOnce(nonExistingMovie);
      state = new State();

      const mockIncomingMessageOne: IncomingMessage = {
        message: {
          from: { first_name: "Joe" },
          chat: { id: "some_chat_id" },
          text: "/setmovie somenonexistentfilm",
        },
      };

      await messageHandler.generateResponse(
        mockIncomingMessageOne,
        mockApi,
        state
      );

      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: "Couldn't find that film",
      });
    });
  });

  describe("The getmovies command", () => {
    const mockIncomingMessage: IncomingMessage = {
      message: {
        from: { first_name: "Joe" },
        chat: { id: "some_chat_id" },
        text: "/getmovies",
      },
    };
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

    test("Should return a message informing the user that no film has been set if no movies have been set", async () => {
      state = new State();

      await messageHandler.generateResponse(
        mockIncomingMessage,
        mockApi,
        state
      );

      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: "No movies have been set yet",
      });
    });
    test("Should return a single movie name if only one film has been set", async () => {
      jest.spyOn(movieFetcher, "getMovie").mockResolvedValueOnce(taken);

      state = new State();

      await messageHandler.generateResponse(
        mockSetFirstMovieStateMessage,
        mockApi,
        state
      );

      await messageHandler.generateResponse(
        mockIncomingMessage,
        mockApi,
        state
      );

      expect(mockSendMessage).toHaveBeenLastCalledWith({
        chat_id: "some_chat_id",
        text: "Taken (IMDb Rating: 7.8/10)",
      });
    });

    test("Should return a comma separated list of the movies that have been set if there are multiple", async () => {
      jest
        .spyOn(movieFetcher, "getMovie")
        .mockResolvedValueOnce(taken)
        .mockResolvedValueOnce(nemo);

      state = new State();

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
        mockIncomingMessage,
        mockApi,
        state
      );

      expect(mockSendMessage).toHaveBeenLastCalledWith({
        chat_id: "some_chat_id",
        text: "Taken (IMDb Rating: 7.8/10)\nFinding Nemo (IMDb Rating: 8.1/10)",
      });
    });
  });
});
