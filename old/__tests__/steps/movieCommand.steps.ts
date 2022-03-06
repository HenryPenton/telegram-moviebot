import * as fetcher from "../../../src/fetcher/fetcher";
import {
  runMessageHandler,
  mockMovieWithInfo,
  mockMovieWithTrailer,
  mockNoTrailer,
  mockOmdbUnavailable,
  mockSendMessage,
  mockYoutubeUnavailable,
} from "../../../src/__mocks__/movies";

import movieNoTitle from "../testData/movieWithoutTitle.json";
import filmNoInfo from "../testData/findingnemoNoInfo.json";
import { State } from "../../../src/State/State";

import { defineFeature, loadFeature } from "jest-cucumber";
import { MessageType } from "../../../src/__mocks__/messages";

const feature = loadFeature("./src/__tests__/features/movieCommand.feature");

defineFeature(feature, (test) => {
  const state = new State();

  const movieWithInfoNoTrailerResponse =
    "Movie: Taken (2008)\n\nRuntime: 90 min\n\nInternet Movie Database: 7.8/10\nRotten Tomatoes: 58%\nMetacritic: 51/100\n\nDirector: Pierre Morel\n\nPlot: A retired CIA agent travels across Europe and relies on his old skills to save his estranged daughter, who has been kidnapped while on a trip to Paris.";

  let command: MessageType;

  test("Getting a movie with info", async ({ given, and, then, when }) => {
    given("an incoming message prefixed with movie", () => {
      command = MessageType.MOVIE;
    });

    and(
      "the movie response has a title and other information about the film",
      () => {
        mockMovieWithInfo();
      }
    );

    and("there is no trailer for the film", () => {
      mockNoTrailer();
    });

    when("the command is executed", async () => {
      await runMessageHandler(command, state);
    });

    then("the response should contain the title and information", () => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: movieWithInfoNoTrailerResponse,
      });
    });
  });

  test("Get a movie by title and Year", ({ given, and, when, then }) => {
    given("a movie command with a year specified", () => {
      command = MessageType.MOVIE_WITH_YEAR;
    });

    and("there are two possible movies by title", () => {
      mockMovieWithInfo();
    });

    when("the command is executed", async () => {
      await runMessageHandler(command, state);
    });

    then("the response should be the movie that relates to the Year", () => {
      const responseWithTitleInformationAndTrailer =
        "Movie: Taken (2008)\n\nRuntime: 90 min\n\nInternet Movie Database: 7.8/10\nRotten Tomatoes: 58%\nMetacritic: 51/100\n\nDirector: Pierre Morel\n\nPlot: A retired CIA agent travels across Europe and relies on his old skills to save his estranged daughter, who has been kidnapped while on a trip to Paris.";

      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: responseWithTitleInformationAndTrailer,
      });
    });
  });

  test("Getting a movie with info and a trailer", ({
    given,
    and,
    when,
    then,
  }) => {
    given("an incoming message prefixed with movie", () => {
      command = MessageType.MOVIE;
    });

    and(
      "the movie response has a title and other information about the film",
      () => {
        mockMovieWithInfo();
      }
    );

    and("there is a trailer for the film", () => {
      mockMovieWithTrailer();
    });

    when("the command is executed", async () => {
      await runMessageHandler(command, state);
    });

    then(
      "the response should contain the title, information and trailer",
      () => {
        const responseWithTitleInformationAndTrailer =
          "Movie: Taken (2008)\n\nRuntime: 90 min\n\nInternet Movie Database: 7.8/10\nRotten Tomatoes: 58%\nMetacritic: 51/100\n\nDirector: Pierre Morel\n\nPlot: A retired CIA agent travels across Europe and relies on his old skills to save his estranged daughter, who has been kidnapped while on a trip to Paris.\n\nhttps://www.youtube.co.uk/watch?v=movieId";

        expect(mockSendMessage).toHaveBeenCalledWith({
          chat_id: "some_chat_id",
          text: responseWithTitleInformationAndTrailer,
        });
      }
    );
  });

  test("Responding to an unavailable film", async ({
    given,
    and,
    when,
    then,
  }) => {
    given("an incoming message prefixed with movie", () => {
      command = MessageType.MOVIE;
    });

    and("the omdb is unvailable", () => {
      mockOmdbUnavailable();
    });

    when("the command is executed", async () => {
      await runMessageHandler(command, state);
    });

    then(/^the response should say "(.*)"$/, (failureResponse: string) => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: failureResponse,
      });
    });
  });

  test("Responding to an unavailable film when getting by title and year", async ({
    given,
    and,
    when,
    then,
  }) => {
    given("an incoming message prefixed with movieyear", () => {
      command = MessageType.MOVIE_WITH_YEAR;
    });

    and("the omdb is unvailable", () => {
      mockOmdbUnavailable();
    });

    when("the command is executed", async () => {
      await runMessageHandler(command, state);
    });

    then(/^the response should say "(.*)"$/, (failureResponse: string) => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: failureResponse,
      });
    });
  });

  test("Responding to an unavailable trailer", ({ given, and, when, then }) => {
    given("an incoming message prefixed with movie", () => {
      command = MessageType.MOVIE;
    });

    and(
      "the movie response has a title and other information about the film",
      () => {
        mockMovieWithInfo();
      }
    );

    and("youtube is unvailable", () => {
      mockYoutubeUnavailable();
    });

    when("the command is executed", async () => {
      await runMessageHandler(command, state);
    });

    then("the response should contain the title and information", () => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: movieWithInfoNoTrailerResponse,
      });
    });
  });

  test("Responding to a movie where the title without a trailer is the only available information", ({
    given,
    and,
    when,
    then,
  }) => {
    given("an incoming message prefixed with movie", () => {
      command = MessageType.MOVIE;
    });

    and("there is only a title available for the film", () => {
      jest.spyOn(fetcher, "fetcher").mockResolvedValueOnce(filmNoInfo);
    });

    and("there is no trailer for the film", () => {
      mockNoTrailer();
    });

    when("the command is executed", async () => {
      await runMessageHandler(command, state);
    });

    then("the response should contain the movie name only", () => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: "Movie: Finding Nemo",
      });
    });
  });

  test("Responding to a movie where the title with a trailer is the only available information", ({
    given,
    and,
    when,
    then,
  }) => {
    given("an incoming message prefixed with movie", () => {
      command = MessageType.MOVIE;
    });

    and("there is only a title available for the film", () => {
      jest.spyOn(fetcher, "fetcher").mockResolvedValueOnce(filmNoInfo);
    });

    and("there is a trailer for the film", () => {
      mockMovieWithTrailer();
    });

    when("the command is executed", async () => {
      await runMessageHandler(command, state);
    });

    then("the response should contain the movie name only", () => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: "Movie: Finding Nemo\n\nhttps://www.youtube.co.uk/watch?v=movieId",
      });
    });
  });
  test("Responding to a movie where the title doesn't exist", ({
    given,
    and,
    when,
    then,
  }) => {
    given("an incoming message prefixed with movie", () => {
      command = MessageType.MOVIE;
    });

    and("there is no title available for the film", () => {
      jest.spyOn(fetcher, "fetcher").mockResolvedValueOnce(movieNoTitle);
    });

    when("the command is executed", async () => {
      await runMessageHandler(command, state);
    });

    then(/^the response should say "(.*)"$/, (failureResponse: string) => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: failureResponse,
      });
    });
  });

  test("Get a movie by id", ({ given, when, then }) => {
    given("a movie command with an id specified", () => {
      mockMovieWithInfo();
      command = MessageType.MOVIE_WITH_ID;
    });

    when("the command is executed", async () => {
      await runMessageHandler(command, state);
    });

    then("the response should be the movie that relates to the id", () => {
      const responseWithTitleInformationAndTrailer =
        "Movie: Taken (2008)\n\nRuntime: 90 min\n\nInternet Movie Database: 7.8/10\nRotten Tomatoes: 58%\nMetacritic: 51/100\n\nDirector: Pierre Morel\n\nPlot: A retired CIA agent travels across Europe and relies on his old skills to save his estranged daughter, who has been kidnapped while on a trip to Paris.";

      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: responseWithTitleInformationAndTrailer,
      });
    });
  });

  test("Get a movie by id but the id doesnt exist", ({ given, when, then }) => {
    given("a movie command with an id specified", () => {
      mockOmdbUnavailable();
      command = MessageType.MOVIE_WITH_ID;
    });

    when("the command is executed", async () => {
      await runMessageHandler(command, state);
    });

    then(/^the response should be "(.*)"$/, (response) => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: response,
      });
    });
  });

  test("Responding to a movie with an id search", ({
    given,
    but,
    when,
    then,
  }) => {
    given("an incoming message prefixed with movie", () => {
      mockMovieWithInfo();

      command = MessageType.MOVIE;
    });

    but("the message starts with tt", () => {
      command = MessageType.MOVIE_BUT_ID;
    });

    when("the command is executed", async () => {
      await runMessageHandler(command, state);
    });

    then("the response should contain the title and information", () => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: movieWithInfoNoTrailerResponse,
      });
    });
  });
});
