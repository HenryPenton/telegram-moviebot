import * as messageHandler from "../../messageHandler/messageHandler";
import * as fetcher from "../../fetcher/fetcher";
import { mockApi, mockSendMessage } from "../../__mocks__/movies";

import filmWithInfo from "../testData/taken.json";
import { State } from "../../State/State";

import { defineFeature, loadFeature } from "jest-cucumber";
import { IncomingMessage } from "../../types";

const feature = loadFeature("./src/__tests__/features/resetCommand.feature");

defineFeature(feature, (test) => {
  const movieWithInfo = () => {
    jest.spyOn(fetcher, "fetcher").mockResolvedValueOnce(filmWithInfo);
  };

  const setFilm = async (state: State) => {
    command = setMovieCommand;
    movieWithInfo();
    await response(command, mockApi, state);
  };

  const reset = async (state: State) => {
    command = resetCommand;
    await response(command, mockApi, state);
  };

  const filmSelectionWasCorrect = async (index: number, expected: string) => {
    expect(mockSendMessage).toHaveBeenNthCalledWith(index, {
      chat_id: "some_chat_id",
      text: expected,
    });
  };

  const filmSelectionReset = async (index: number, state: State) => {
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

  const resetCommand: IncomingMessage = {
    message: {
      from: { first_name: "Joe" },
      chat: { id: "some_chat_id" },
      text: "/reset",
    },
  };

  let command: IncomingMessage;

  test("reset command wipes the single film in the film selection", ({
    and,
    given,
    when,
    then,
  }) => {
    const state = new State();

    given("a film selection", async () => {
      await setFilm(state);
    });

    and("the film selection has one film in it", async () => {
      command = getMovieCommand;
      await response(command, mockApi, state);
    });

    when("the reset command is sent", async () => {
      await reset(state);
    });

    then("the film selection is reset", async () => {
      await filmSelectionWasCorrect(2, "1. Taken (IMDb Rating: 7.8/10)");

      await filmSelectionReset(4, state);
    });
  });

  test("reset command wipes multiple films in the film selection", ({
    given,
    and,
    when,
    then,
  }) => {
    const state = new State();

    given("a film selection", async () => {
      await setFilm(state);
      await setFilm(state);
    });

    and("the film selection has multiple films in it", async () => {
      command = getMovieCommand;
      await response(command, mockApi, state);
    });

    when("the reset command is sent", async () => {
      await reset(state);
    });

    then("the film selection is reset", async () => {
      await filmSelectionWasCorrect(
        3,
        "1. Taken (IMDb Rating: 7.8/10)\n2. Taken (IMDb Rating: 7.8/10)"
      );
      await filmSelectionReset(5, state);
    });
  });

  test("Polls are wiped by the reset command", ({ given, when, then }) => {
    const state = new State();

    given("a moviepoll", () => {
      state.polls = [
        { id: "some id", movieVotes: [{ votes: [], movie: "some movie" }] },
      ];
    });

    when("the reset command is sent", async () => {
      await reset(state);
    });

    then("poll is reset", () => {
      expect(state.polls).toEqual([]);
    });
  });
});
