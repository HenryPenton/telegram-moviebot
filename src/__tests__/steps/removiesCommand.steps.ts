import * as messageHandler from "../../messageHandler/messageHandler";
import * as fetcher from "../../fetcher/fetcher";

import filmWithInfo from "../testData/taken.json";
import { State } from "../../State/State";

import { defineFeature, loadFeature } from "jest-cucumber";
import { IncomingMessage } from "../../types";

const feature = loadFeature("./src/__tests__/features/removiesCommand.feature");

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

  test("Removies command wipes the single film in the film selection", ({
    and,
    given,
    when,
    then,
  }) => {
    given("a film selection", async () => {
      await setFilm();
    });

    and("the film selection has one film in it", async () => {
      command = getMovieCommand;
      await response(command, mockApi, state);
    });

    when("the removies command is sent", async () => {
      await removie();
    });

    then("the film selection is reset", async () => {
      await filmSelectionWasCorrect(2, "1. Taken (IMDb Rating: 7.8/10)");

      await filmSelectionReset(4);
    });
  });

  test("Removies command wipes multiple films in the film selection", ({
    given,
    and,
    when,
    then,
  }) => {
    given("a film selection", async () => {
      await setFilm();
      await setFilm();
    });

    and("the film selection has multiple films in it", async () => {
      command = getMovieCommand;
      await response(command, mockApi, state);
    });

    when("the removies command is sent", async () => {
      await removie();
    });

    then("the film selection is reset", async () => {
      await filmSelectionWasCorrect(
        3,
        "1. Taken (IMDb Rating: 7.8/10)\n2. Taken (IMDb Rating: 7.8/10)"
      );
      await filmSelectionReset(5);
    });
  });
});
