import * as messageHandler from "../../messageHandler/messageHandler";
import * as fetcher from "../../fetcher/fetcher";
import * as movieFetcher from "../../fetcher/movie/movieFetcher";
import * as trailerFetcher from "../../fetcher/trailer/trailerFetcher";

import filmWithInfo from "../testData/taken.json";
import movieNoTitle from "../testData/movieWithoutTitle.json";
import nemo from "../testData/findingnemo.json";
import nemoNoInfo from "../testData/findingnemoNoInfo.json";
import { State } from "../../State/State";

import { defineFeature, loadFeature } from "jest-cucumber";
import { IncomingMessage } from "../../types";

const feature = loadFeature("./src/__tests__/features/movieCommand.feature");

defineFeature(feature, (test) => {
  const movieWithInfo = () => {
    jest.spyOn(fetcher, "fetcher").mockResolvedValueOnce(filmWithInfo);
  };
  const omdbUnavailable = () => {
    jest.spyOn(fetcher, "fetcher").mockRejectedValueOnce("some error");
  };
  const youtubeUnavailable = () => {
    jest.spyOn(fetcher, "fetcher").mockRejectedValueOnce("some error");
  };

  const noTrailer = () => {
    jest.spyOn(trailerFetcher, "getTrailer").mockResolvedValueOnce("");
  };

  const movieWithTrailer = () => {
    jest
      .spyOn(trailerFetcher, "getTrailer")
      .mockResolvedValueOnce("www.trailers.co.uk/watch");
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

  const movieCommand: IncomingMessage = {
    message: {
      from: { first_name: "Joe" },
      chat: { id: "some_chat_id" },
      text: "/movie somefilmname",
    },
  };

  const movieWithInfoNoTrailerResponse: string =
    "Movie: Taken (2008)\n\nRuntime: 90 min\n\nInternet Movie Database: 7.8/10\nRotten Tomatoes: 58%\nMetacritic: 51/100\n\nDirector: Pierre Morel\n\nPlot: A retired CIA agent travels across Europe and relies on his old skills to save his estranged daughter, who has been kidnapped while on a trip to Paris.";

  let command: IncomingMessage;

  test("Getting a movie with info", async ({ given, and, then, when }) => {
    given("an incoming message prefixed with movie", () => {
      command = movieCommand;
    });

    and(
      "the movie response has a title and other information about the film",
      () => {
        movieWithInfo();
      }
    );

    and("there is no trailer for the film", () => {
      noTrailer();
    });

    when("the command is executed", async () => {
      await response(command, mockApi, state);
    });

    then("the response should contain the title and information", () => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: movieWithInfoNoTrailerResponse,
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
      command = movieCommand;
    });

    and(
      "the movie response has a title and other information about the film",
      () => {
        movieWithInfo();
      }
    );

    and("there is a trailer for the film", () => {
      movieWithTrailer();
    });

    when("the command is executed", async () => {
      await response(command, mockApi, state);
    });

    then(
      "the response should contain the title, information and trailer",
      () => {
        const responseWithTitleInformationAndTrailer: string =
          "Movie: Taken (2008)\n\nRuntime: 90 min\n\nInternet Movie Database: 7.8/10\nRotten Tomatoes: 58%\nMetacritic: 51/100\n\nDirector: Pierre Morel\n\nPlot: A retired CIA agent travels across Europe and relies on his old skills to save his estranged daughter, who has been kidnapped while on a trip to Paris.\n\nwww.trailers.co.uk/watch";

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
      command = movieCommand;
    });

    and("the omdb is unvailable", () => {
      omdbUnavailable();
    });

    when("the command is executed", async () => {
      await response(command, mockApi, state);
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
      command = movieCommand;
    });

    and(
      "the movie response has a title and other information about the film",
      () => {
        movieWithInfo();
      }
    );

    and("youtube is unvailable", () => {
      youtubeUnavailable();
    });

    when("the command is executed", async () => {
      await response(command, mockApi, state);
    });

    then("the response should contain the title and information", () => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: movieWithInfoNoTrailerResponse,
      });
    });
  });
});
