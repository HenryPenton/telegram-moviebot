import { ResponseType } from "../messageHandler/messageHandler";
import { IncomingMessage } from "../types";
import * as messageHandler from "../messageHandler/messageHandler";
import { State } from "../State/State";

describe("The getmovies command", () => {
  let state;

  const mockSendMessage = jest.fn();
  jest.spyOn(messageHandler, "respond").mockImplementation(mockSendMessage);
  beforeEach(() => {
    mockSendMessage.mockReset();
  });
  const mockIncomingMessage: IncomingMessage = {
    message: {
      from: { first_name: "Joe" },
      chat: { id: "some_chat_id" },
      text: "/getmovies",
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
    state.movies = [{ name: "Taken" }];
    const mockResponse: string = "Taken";

    await messageHandler.generateResponse(
      mockIncomingMessage,
      "fake api",
      state
    );

    expect(mockSendMessage).toHaveBeenCalledWith(
      mockResponse,
      "some_chat_id",
      ResponseType.message,
      "fake api"
    );
  });
  test("Should return a comma separated list of the movies that have been set if there are multiple", async () => {
    state = new State();
    state.movies = [{ name: "Taken" }, { name: "Finding nemo" }];
    const mockResponse: string = "Taken, Finding nemo";

    await messageHandler.generateResponse(
      mockIncomingMessage,
      "fake api",
      state
    );

    expect(mockSendMessage).toHaveBeenCalledWith(
      mockResponse,
      "some_chat_id",
      ResponseType.message,
      "fake api"
    );
  });
  test("should tell me who selected the film", () => {});
});
