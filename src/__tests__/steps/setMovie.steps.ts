import {
  runMessageHandler,
  mockMovieWithInfo,
  mockSendMessage,
  mockOmdbUnavailable,
  mockMovieWithDifferentRatings,
  mockMovieWithNoRatings,
  mockMovieWithoutTitle,
  mockMovieWithBlankRatings,
} from "../../__mocks__/movies";
import { loadFeature, defineFeature } from "jest-cucumber";
import { State } from "../../State/State";

import { MessageType } from "../../__mocks__/messages";

const feature = loadFeature("./src/__tests__/features/setMovie.feature");

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

  test("Set a movie using the setmovie command", ({ given, when, then }) => {
    given("A setmovie command", () => {
      mockMovieWithInfo();
    });

    when("the command is executed", async () => {
      await runMessageHandler(MessageType.SET_MOVIE, state);
    });

    then("the movie is set", () => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: "Taken (IMDb Rating: 7.8/10) added to the film selection",
      });
    });
  });

  test("Set a movie with ratings from a different source using the setmovie command", ({
    given,
    and,
    when,
    then,
  }) => {
    given("A setmovie command", () => {
      mockMovieWithDifferentRatings();
    });

    and(
      "the movie has ratings from a source other than the most common",
      () => {
        //set above
      }
    );

    when("the command is executed", async () => {
      await runMessageHandler(MessageType.SET_MOVIE, state);
    });

    then("the movie is set", () => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: "Taken (Rotten Tomatoes Rating: 58%) added to the film selection",
      });
    });

    and("the ratings are displayed correctly", () => {
      //set in expectation above (rotten tomatoes instead of imdb)
    });
  });

  test("Set a movie with no ratings", ({ given, and, when, then }) => {
    given("A setmovie command", () => {
      mockMovieWithNoRatings();
    });

    and("the movie has no ratings", () => {
      //set above
    });

    when("the command is executed", async () => {
      await runMessageHandler(MessageType.SET_MOVIE, state);
    });

    then("the movie is set", () => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: "Submarine added to the film selection",
      });
    });

    and("no ratings are displayed", () => {
      //verified above (no brackets with rating)
    });
  });

  test("Movie without title returns unknown movie", ({
    given,
    when,
    but,
    then,
  }) => {
    given("A setmovie command", () => {
      mockMovieWithoutTitle();
    });

    when("the command is executed", async () => {
      await runMessageHandler(MessageType.SET_MOVIE, state);
    });

    but("the response has no title", () => {
      //dealt with in mockMovieWithoutTitle();
    });

    then(/^the message reads "(.*)"$/, (text: string) => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text,
      });
    });
  });

  test("Movie that doesnt exist in the database isnt set", ({
    given,
    when,
    but,
    then,
  }) => {
    given("A setmovie command", () => {
      mockMovieWithoutTitle();
    });

    when("the command is executed", async () => {
      await runMessageHandler(MessageType.SET_MOVIE, state);
    });

    but("the movie doesnt exist in the database", () => {
      //dealt with in mockMovieWithoutTitle();
    });

    then(/^the message reads "(.*)"$/, (text: string) => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text,
      });
    });
  });

  test("Movie with blank ratings array returns no ratings", ({
    given,
    when,
    but,
    then,
  }) => {
    given("A setmovie command", () => {
      mockMovieWithBlankRatings();
    });

    when("the command is executed", async () => {
      await runMessageHandler(MessageType.SET_MOVIE, state);
    });

    but("the movie has a blank ratings array", () => {
      //dealt with in the mock
    });

    then("the set movie has no ratings associated with it", () => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: "Taken added to the film selection",
      });
    });
  });
});
