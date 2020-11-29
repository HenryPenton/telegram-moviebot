import { ResponseType } from "../messageHandler/messageHandler";
import { IncomingMessage } from "../types";
import * as messageHandler from "../messageHandler/messageHandler";
import { State } from "../State/State";
describe("The get and set movie commands", () => {
  let state: State;

  const mockSendMessage = jest.fn();
  jest.spyOn(messageHandler, "respond").mockImplementation(mockSendMessage);
  beforeEach(() => {
    mockSendMessage.mockReset();
  });
  describe("The setmovie command", () => {
    test("should fire a message with the film name when someone sets a movie", async () => {
      state = new State();

      const mockIncomingMessageOne: IncomingMessage = {
        message: {
          from: { first_name: "Joe" },
          chat: { id: "some_chat_id" },
          text: "/setmovie Taken",
        },
      };

      const mockResponseOne: string = "Taken added to the film selection";

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
      state = new State();

      const mockResponse: string = "Taken";

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
      state = new State();

      const mockResponse: string = "Taken, Finding nemo";
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
