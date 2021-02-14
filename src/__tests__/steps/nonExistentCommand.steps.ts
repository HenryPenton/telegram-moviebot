import * as messageHandler from "../../messageHandler/messageHandler";
import { State } from "../../State/State";
import { mockApi, mockSendMessage } from "../../__mocks__/movies";

import { defineFeature, loadFeature } from "jest-cucumber";
import { IncomingMessage } from "../../types";

const feature = loadFeature(
  "./src/__tests__/features/nonExistentCommand.feature"
);

defineFeature(feature, (test) => {
  const run = async (invalidOrNonExistentCommand: string) => {
    command = nonExistentCommand(invalidOrNonExistentCommand);
    await response(command, mockApi, state);
  };

  const response = async (
    command: IncomingMessage,
    mockApi: any,
    state: State
  ) => {
    await messageHandler.generateResponse(command, mockApi, state);
  };

  let state = new State();

  const nonExistentCommand = (unknownCommand: string): IncomingMessage => ({
    message: {
      from: { first_name: "Joe" },
      chat: { id: "some_chat_id" },
      text: unknownCommand,
    },
  });

  let command: IncomingMessage;
  test("Invalid command", ({ when, then }) => {
    when("an invalid command is sent", async () => {
      await run("/dontknowthiscommand");
    });

    then("There should be no response", () => {
      expect(mockSendMessage).not.toHaveBeenCalled();
    });
  });

  test("Non existent commands", ({ when, then }) => {
    when(
      /^a non existent command of varying number of (.*) is sent$/,
      async (notACommand: string) => {
        await run(notACommand);
      }
    );

    then("there should be no response", () => {
      expect(mockSendMessage).not.toHaveBeenCalled();
    });
  });
});
