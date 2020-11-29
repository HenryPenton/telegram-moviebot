import { ResponseType } from "../messageHandler/messageHandler";
import { IncomingMessage } from "../types";
import * as messageHandler from "../messageHandler/messageHandler";
import { State } from "../State/State";
describe("the moviepoll command", () => {
  let state: State;

  const mockSendMessage = jest.fn();
  jest.spyOn(messageHandler, "respond").mockImplementation(mockSendMessage);
  beforeEach(() => {
    mockSendMessage.mockReset();
  });
  test("Should send a message informing users that at least two movies have to be set before a poll can be sent out IF there are fewer than two movies", async () => {
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
      ResponseType.moviePoll,
      "fake api"
    );
  });
});
