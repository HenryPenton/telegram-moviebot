import { State } from "../../State/State";
import {
  mockSendMessage,
  runInvalidMessageHandler,
  runMessageHandler,
} from "../../__mocks__/movies";

import { defineFeature, loadFeature } from "jest-cucumber";
import { MessageType } from "../../__mocks__/messages";

const feature = loadFeature(
  "./src/__tests__/features/nonExistentCommand.feature"
);

defineFeature(feature, (test) => {
  let state = new State();

  test("Regular message", ({ when, then }) => {
    when("a regular message is sent", async () => {
      await runMessageHandler(MessageType.UNKNOWN_COMMAND, state);
    });

    then("There should be no response", () => {
      expect(mockSendMessage).not.toHaveBeenCalled();
    });
  });

  test("Non existent commands", ({ when, then }) => {
    when(
      /^a non existent command of varying number of (.*) is sent$/,
      async () => {
        await runMessageHandler(MessageType.NON_EXISTSTENT_COMMAND, state);
      }
    );

    then("there should be no response", () => {
      expect(mockSendMessage).not.toHaveBeenCalled();
    });
  });
});
