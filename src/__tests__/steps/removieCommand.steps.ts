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

  const removie = async () => {
    command = removiesCommand;
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

  const state = new State();

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

  const removiesCommand: IncomingMessage = {
    message: {
      from: { first_name: "Joe" },
      chat: { id: "some_chat_id" },
      text: "/removies",
    },
  };

  let command: IncomingMessage;

  test("Remove a movie by id", ({ given, and, when, then }) => {
    given("a film selection", () => {});

    and(
      /^the selection has any (.*) of movies in it$/,
      (numberOfMovies: number) => {
        let count = numberOfMovies;
        while (count > 0) {
          count--;
          setFilm();
        }
      }
    );

    when("the removie command is sent", () => {});

    then(
      /^the film with at position (.*) in the selection is removed$/,
      (index: number) => {}
    );
  });
});
