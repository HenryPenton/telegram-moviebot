import {
  runMessageHandler,
  mockMovieWithInfo,
  mockSendMessage,
} from "../../__mocks__/movies";
import { loadFeature, defineFeature } from "jest-cucumber";
import { State } from "../../State/State";

import { MessageType } from "../../__mocks__/messages";

const feature = loadFeature("./src/__tests__/features/getMovies.feature");

defineFeature(feature, (test) => {
  let state: State;
  beforeEach(() => {
    state = new State();
  });
  // test("Set a movie using the setmovieyear command", ({
  //   given,
  //   when,
  //   then,
  // }) => {
  //   given("A setmovieyear command", () => {
  //     mockMovieWithInfo();
  //   });

  //   when("the command is executed", async () => {
  //     await runMessageHandler(MessageType.SET_MOVIE_WITH_YEAR, state);
  //   });

  //   then("the movie is set", () => {
  //     expect(mockSendMessage).toHaveBeenCalledWith({
  //       chat_id: "some_chat_id",
  //       text: "Taken (IMDb Rating: 7.8/10) added to the film selection",
  //     });
  //   });
  // });

  test("User is informed that no film has been set", ({
    given,
    and,
    when,
    then,
  }) => {
    given("A getmovies command", () => {
      //blank
    });

    and("the selection is blank", () => {
      state.movies = [];
    });

    when("the command is executed", async () => {
      await runMessageHandler(MessageType.GET_MOVIES, state);
    });

    then(/^The user sees the message "(.*)"$/, (text: string) => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text,
      });
    });
  });

  test("User shown a single film if one film is set", ({
    given,
    and,
    when,
    then,
  }) => {
    given("A getmovies command", () => {
      //blank
    });

    and("the selection has a single film in it", () => {
      state.movies = [{ Title: "First film in selection" }];
    });

    when("the command is executed", async () => {
      await runMessageHandler(MessageType.GET_MOVIES, state);
    });

    then(/^The user sees the message "(.*)"$/, (text: string) => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text,
      });
    });
  });

  test("User shown a multiple films if multiple have been set", ({
    given,
    and,
    when,
    then,
  }) => {
    given("A getmovies command", () => {
      //blank
    });

    and("the selection has two films in it", () => {
      state.movies = [
        { Title: "First film in selection" },
        { Title: "Second film in selection" },
      ];
    });

    when("the command is executed", async () => {
      await runMessageHandler(MessageType.GET_MOVIES, state);
    });

    then("The user sees a list containing both films", () => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: `1. First film in selection\n2. Second film in selection`,
      });
    });
  });
});
