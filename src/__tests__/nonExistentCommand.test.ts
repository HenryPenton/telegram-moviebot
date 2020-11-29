import * as messageHandler from "../messageHandler/messageHandler";
import { IncomingMessage } from "../types";

describe("regular messages", () => {
  const mockSendMessage = jest.fn();
  jest.spyOn(messageHandler, "respond").mockImplementation(mockSendMessage);
  beforeEach(() => {
    mockSendMessage.mockReset();
  });
  test("no response should be seen if the command is invalid", async () => {
    const mockIncomingMessageTwo: IncomingMessage = {
      message: {
        from: { first_name: "Henry" },
        chat: { id: "some_chat_id" },
        text: "/notACommand some message",
      },
    };

    await messageHandler.generateResponse(mockIncomingMessageTwo, "fake api");

    expect(mockSendMessage).not.toHaveBeenCalled();
  });
  test("no response should be seen if the command is non-existent", async () => {
    const mockIncomingMessageTwo: IncomingMessage = {
      message: {
        from: { first_name: "Henry" },
        chat: { id: "some_chat_id" },
        text: "some message",
      },
    };

    await messageHandler.generateResponse(mockIncomingMessageTwo, "fake api");

    expect(mockSendMessage).not.toHaveBeenCalled();
  });
});
