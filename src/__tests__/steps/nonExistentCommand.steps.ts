import { State } from "../../State/State";
import {
  mockSendMessage,
  runInvalidMessageHandler,
} from "../../__mocks__/movies";

import { defineFeature, loadFeature } from "jest-cucumber";

const feature = loadFeature(
  "./src/__tests__/features/nonExistentCommand.feature"
);

defineFeature(feature, (test) => {
  let state = new State();

  test("Invalid command", ({ when, then }) => {
    when("an invalid command is sent", async () => {
      await runInvalidMessageHandler("/dontknowthiscommand", state);
    });

    then("There should be no response", () => {
      expect(mockSendMessage).not.toHaveBeenCalled();
    });
  });

  test("Non existent commands", ({ when, then }) => {
    when(
      /^a non existent command of varying number of (.*) is sent$/,
      async () => {
        await runInvalidMessageHandler("/dontknowthiscommand", state);
      }
    );

    then("there should be no response", () => {
      expect(mockSendMessage).not.toHaveBeenCalled();
    });
  });
});
