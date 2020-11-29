import { ResponseType } from "../messageHandler/messageHandler";
import { IncomingMessage } from "../types";
import * as messageHandler from "../messageHandler/messageHandler";
import * as movieFetcher from "../fetcher/movieFetcher";
import { State } from "../State/State";

import taken from "./testData/taken.json";
import nemo from "./testData/findingnemo.json";
import nonExistingMovie from "./testData/nonExiststentFilm.json";

describe("The get and set movie commands", () => {
  let state: State;

  const mockSendMessage = jest.fn();
  jest.spyOn(messageHandler, "respond").mockImplementation(mockSendMessage);
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

      const mockResponseOne: string =
        "Finding Nemo added to the film selection";

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

      const mockResponseOne: string = "Couldn't find that film";

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
      const mockResponseOne: string = "No movies have been set yet";

      await messageHandler.generateResponse(
        mockIncomingMessage,
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
    test("Should return a single movie name if only one film has been set", async () => {
      jest.spyOn(movieFetcher, "getMovie").mockResolvedValueOnce(taken);

      state = new State();

      const mockResponse: string = "Taken (IMDb Rating: 7.8/10)";

      await messageHandler.generateResponse(
        mockSetFirstMovieStateMessage,
        "fake api",
        state
      );

      await messageHandler.generateResponse(
        mockIncomingMessage,
        "fake api",
        state
      );

      expect(mockSendMessage).toHaveBeenLastCalledWith(
        mockResponse,
        "some_chat_id",
        ResponseType.message,
        "fake api"
      );
    });

    test("Should return a comma separated list of the movies that have been set if there are multiple", async () => {
      jest
        .spyOn(movieFetcher, "getMovie")
        .mockResolvedValueOnce(taken)
        .mockResolvedValueOnce(nemo);

      state = new State();

      const mockResponse: string =
        "Taken (IMDb Rating: 7.8/10), Finding Nemo (IMDb Rating: 8.1/10)";
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
        mockIncomingMessage,
        "fake api",
        state
      );

      expect(mockSendMessage).toHaveBeenLastCalledWith(
        mockResponse,
        "some_chat_id",
        ResponseType.message,
        "fake api"
      );
    });
  });
});
