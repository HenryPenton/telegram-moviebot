import * as messageHandler from "../../messageHandler/messageHandler";
import { State } from "../../State/State";
import { defineFeature, loadFeature } from "jest-cucumber";
import { IncomingMessage } from "../../types";

const feature = loadFeature("./src/__tests__/features/removieCommand.feature");

defineFeature(feature, (test) => {
  const removie = async (index: number | string) => {
    command = removieCommand(index);
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

  const mockSendMessage = jest.fn(() => {});
  const mockApi = { sendMessage: mockSendMessage };
  beforeEach(() => {
    mockSendMessage.mockReset();
  });

  const removieCommand = (movieNameOrId: number | string): IncomingMessage => ({
    message: {
      from: { first_name: "Joe" },
      chat: { id: "some_chat_id" },
      text: `/removie ${movieNameOrId}`,
    },
  });

  let command: IncomingMessage;

  test("Remove a movie by id", ({ given, and, when, then }) => {
    given("a film selection", () => {
      state = new State();
    });

    and(
      /^the selection has any (.*) of movies in it$/,
      async (numberOfMovies: number) => {
        let count = numberOfMovies;
        while (count > 0) {
          count--;
          state.setMovie(`${numberOfMovies - count}`);
        }
      }
    );

    when(/^the removie (.*) command is sent$/, async (index: number) => {
      await removie(index);
    });

    then(
      /^the film with at position (.*) in the selection is removed$/,
      (index: number) => {
        expect(mockSendMessage).toHaveBeenCalledWith({
          chat_id: "some_chat_id",
          text: `${index} removed from the selection`,
        });

        expect(state.getMovies()).not.toContain(`${index}`);
      }
    );
  });

  test("Remove movie by name", ({ given, when, then }) => {
    given("a film selection", () => {
      state = new State();
    });

    given("the selection has a movie in it", () => {
      state.setMovie("finding nemo");
    });

    when("the removie command is sent with the name of the film", () => {
      removie("finding nemo");
    });

    then("the film is removed", () => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: `finding nemo removed from the selection`,
      });

      expect(state.getMovies()).not.toContain(`finding nemo`);
    });
  });

  test("Id/name that doesnt relate to a movie", ({
    given,
    and,
    when,
    then,
  }) => {
    given("a film selection", () => {
      state = new State();
    });

    and("the selection has a movie in it", () => {
      state.setMovie("1");
    });

    when(
      /^the removie command is sent with an (.*) that doesnt relate to a movie$/,
      async (nameOrId: number | string) => {
        await removie(nameOrId);
      }
    );

    then("nothing is removed from the film selection", () => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: "Couldn't find that film in the selection",
      });
      expect(state.movies).toHaveLength(1);
    });
  });
});
