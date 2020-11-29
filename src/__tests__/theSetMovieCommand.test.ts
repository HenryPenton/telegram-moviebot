import { ResponseType } from "../messageHandler/messageHandler";
import { IncomingMessage } from "../types";
import * as messageHandler from "../messageHandler/messageHandler";

describe("the setmovie command", () => {
  const mockSendMessage = jest.fn();
  jest.spyOn(messageHandler, "respond").mockImplementation(mockSendMessage);
  beforeEach(() => {
    mockSendMessage.mockReset();
  });
  test("should fire a message with the film name when someone sets a movie", async () => {
    const mockIncomingMessageOne: IncomingMessage = {
      message: {
        from: { first_name: "Joe" },
        chat: { id: "some_chat_id" },
        text: "/setmovie Taken",
      },
    };

    const mockResponseOne: string = "Taken added to the film selection";

    await messageHandler.generateResponse(mockIncomingMessageOne, "fake api");

    expect(mockSendMessage).toHaveBeenCalledWith(
      mockResponseOne,
      "some_chat_id",
      ResponseType.message,
      "fake api"
    );
  });
  
});
