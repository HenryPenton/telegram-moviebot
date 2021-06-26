import {
  runMessageHandler,
  mockMovieWithInfo,
  mockSendMessage,
  mockOmdbUnavailable,
} from "../../__mocks__/movies";
import { loadFeature, defineFeature } from "jest-cucumber";
import { State } from "../../State/State";

import { MessageType } from "../../__mocks__/messages";

const feature = loadFeature("./src/__tests__/features/getAndSetMovie.feature");

defineFeature(feature, (test) => {
  let state: State;
  beforeEach(() => {
    state = new State();
  });
  test("Set a movie using the setmovieyear command", ({
    given,
    when,
    then,
  }) => {
    given("A setmovieyear command", () => {
      mockMovieWithInfo();
    });

    when("the command is executed", async () => {
      await runMessageHandler(MessageType.SET_MOVIE_WITH_YEAR, state);
    });

    then("the movie is set", () => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: "Taken (IMDb Rating: 7.8/10) added to the film selection",
      });
    });
  });

  test("Set a movie using the setmovieid command", ({ given, when, then }) => {
    given("A setmovieid command", () => {
      mockMovieWithInfo();
    });

    when("the command is executed", async () => {
      await runMessageHandler(MessageType.SET_MOVIE_WITH_ID, state);
    });

    then("the movie is set", () => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: "Taken (IMDb Rating: 7.8/10) added to the film selection",
      });
    });
  });

  test("Set two movies at once by name", ({ given, when, then }) => {
    given("A setmovie command with two film separated by %%", () => {
      mockMovieWithInfo();
      mockMovieWithInfo();
    });

    when("the command is executed", async () => {
      await runMessageHandler(MessageType.SET_MULTI_MOVIE, state);
    });

    then("all of the movies are set", () => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: "Taken (IMDb Rating: 7.8/10) and Taken (IMDb Rating: 7.8/10) added to the film selection",
      });
    });
  });

  test("Set three movies at once by name", ({ given, when, then }) => {
    given("A setmultimovie command", () => {
      mockMovieWithInfo();
      mockMovieWithInfo();
      mockMovieWithInfo();
    });

    when("the command is executed", async () => {
      await runMessageHandler(MessageType.SET_THREE_MULTI_MOVIE, state);
    });

    then("all of the movies are set", () => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: "Taken (IMDb Rating: 7.8/10), Taken (IMDb Rating: 7.8/10) and Taken (IMDb Rating: 7.8/10) added to the film selection",
      });
    });
  });

  test("Set three movies at once by name but one of the movies fails", ({
    given,
    when,
    but,
    then,
  }) => {
    given("A setmultimovie command", () => {
      mockMovieWithInfo();
      mockMovieWithInfo();
      mockOmdbUnavailable();
    });

    when("the command is executed", async () => {
      await runMessageHandler(MessageType.SET_THREE_MULTI_MOVIE, state);
    });

    but("one of the movie fetches fails", () => {
      //empty - setup happened in the given
    });

    then("two of the three movies are set", () => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: "Taken (IMDb Rating: 7.8/10) and Taken (IMDb Rating: 7.8/10) added to the film selection",
      });
    });
  });

  test("Set three movies at once by name but all fail", ({
    given,
    when,
    but,
    then,
  }) => {
    given("A setmultimovie command", () => {
      mockOmdbUnavailable();
      mockOmdbUnavailable();
      mockOmdbUnavailable();
    });

    when("the command is executed", async () => {
      await runMessageHandler(MessageType.SET_THREE_MULTI_MOVIE, state);
    });

    but("all of the movie fetches fail", () => {
      //empty - setup in the given
    });

    then(/^the message reads "(.*)"$/, (errorMessage) => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: errorMessage,
      });
    });
  });
});
