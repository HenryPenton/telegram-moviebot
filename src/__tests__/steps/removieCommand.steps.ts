import * as messageHandler from "../../messageHandler/messageHandler";
import * as fetcher from "../../fetcher/fetcher";

import filmWithInfo from "../testData/taken.json";
import { State } from "../../State/State";

import { defineFeature, loadFeature } from "jest-cucumber";
import { IncomingMessage } from "../../types";

const feature = loadFeature("./src/__tests__/features/removieCommand.feature");

defineFeature(feature, (test) => {
  const movieWithInfo = () => {
    jest.spyOn(fetcher, "fetcher").mockResolvedValueOnce(filmWithInfo);
  };

  const setFilm = async () => {
    command = setMovieCommand;
    movieWithInfo();
    await response(command, mockApi, state);
  };

  const removie = async (index: number) => {
    command = removieCommand(index);
    await response(command, mockApi, state);
  };

  const filmSelectionWasCorrect = async (index: number, expected: string) => {
    expect(mockSendMessage).toHaveBeenNthCalledWith(index, {
      chat_id: "some_chat_id",
      text: expected,
    });
  };

  const filmSelectionReset = async (index: number) => {
    command = getMovieCommand;
    await response(command, mockApi, state);

    expect(mockSendMessage).toHaveBeenNthCalledWith(index, {
      chat_id: "some_chat_id",
      text: "No movies have been set yet",
    });
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

  const setMovieCommand: IncomingMessage = {
    message: {
      from: { first_name: "Joe" },
      chat: { id: "some_chat_id" },
      text: "/setmovie somefilmname",
    },
  };

  const getMovieCommand: IncomingMessage = {
    message: {
      from: { first_name: "Joe" },
      chat: { id: "some_chat_id" },
      text: "/getmovies",
    },
  };

  const removieCommand = (index: number): IncomingMessage => ({
    message: {
      from: { first_name: "Joe" },
      chat: { id: "some_chat_id" },
      text: `/removie ${index}`,
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

    when(/^the removie (.*) command is sent$/, (index: number) => {
      removie(index);
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
});
