import * as messageHandler from "../messageHandler/messageHandler";
import { State } from "../State/State";
import { IncomingMessage } from "../types";

describe("regular messages", () => {
  const mockSendMessage = jest.fn(() => {});
  const mockApi = { sendMessage: mockSendMessage };
  beforeEach(() => {
    mockSendMessage.mockReset();
  });
  const state = new State();

  test("no response should be seen if the command is invalid", async () => {
    const mockIncomingMessageTwo: IncomingMessage = {
      message: {
        from: { first_name: "Henry" },
        chat: { id: "some_chat_id" },
        text: "/notACommand some message",
      },
    };

    await messageHandler.generateResponse(
      mockIncomingMessageTwo,
      mockApi,
      state
    );

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

    await messageHandler.generateResponse(
      mockIncomingMessageTwo,
      mockApi,
      state
    );

    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  test("no response should be seen if the command is non-existent and the message is one word long", async () => {
    const mockIncomingMessageTwo: IncomingMessage = {
      message: {
        from: { first_name: "Henry" },
        chat: { id: "some_chat_id" },
        text: "message",
      },
    };

    await messageHandler.generateResponse(
      mockIncomingMessageTwo,
      mockApi,
      state
    );

    expect(mockSendMessage).not.toHaveBeenCalled();
  });
  test("no response should be seen if the command is non-existent and the message empty", async () => {
    const mockIncomingMessageTwo: IncomingMessage = {
      message: {
        from: { first_name: "Henry" },
        chat: { id: "some_chat_id" },
        text: "",
      },
    };

    await messageHandler.generateResponse(
      mockIncomingMessageTwo,
      mockApi,
      state
    );

    expect(mockSendMessage).not.toHaveBeenCalled();
  });
});
