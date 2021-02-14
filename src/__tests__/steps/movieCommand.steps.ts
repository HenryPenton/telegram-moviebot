import * as messageHandler from "../../messageHandler/messageHandler";
import * as fetcher from "../../fetcher/fetcher";
import { mockApi, mockSendMessage } from "../../__mocks__/movies";

import filmWithInfo from "../testData/taken.json";
import movieNoTitle from "../testData/movieWithoutTitle.json";
import filmNoInfo from "../testData/findingnemoNoInfo.json";
import movieTrailer from "../testData/ytResponse.json";
import { State } from "../../State/State";

import { defineFeature, loadFeature } from "jest-cucumber";
import { IncomingMessage } from "../../types";

const feature = loadFeature("./src/__tests__/features/movieCommand.feature");

defineFeature(feature, (test) => {
  const mockMovieWithInfo = () => {
    jest.spyOn(fetcher, "fetcher").mockResolvedValueOnce(filmWithInfo);
  };
  const mockOmdbUnavailable = () => {
    jest.spyOn(fetcher, "fetcher").mockRejectedValueOnce("some error");
  };
  const mockYoutubeUnavailable = () => {
    jest.spyOn(fetcher, "fetcher").mockRejectedValueOnce("some error");
  };

  const mockNoTrailer = () => {
    jest.spyOn(fetcher, "fetcher").mockRejectedValueOnce("some error");
  };

  const mockMovieWithTrailer = () => {
    jest.spyOn(fetcher, "fetcher").mockResolvedValueOnce(movieTrailer);
  };

  const mockMovieWithYear = () => {
    jest.spyOn(fetcher, "fetcher").mockResolvedValueOnce(movieTrailer);
  };

  const response = async (
    command: IncomingMessage,
    mockApi: any,
    state: State
  ) => {
    await messageHandler.generateResponse(command, mockApi, state);
  };

  const state = new State();

  const movieCommand: IncomingMessage = {
    message: {
      from: { first_name: "Joe" },
      chat: { id: "some_chat_id" },
      text: "/movie somefilmname",
    },
  };

  const movieWithYearCommand: IncomingMessage = {
    message: {
      from: { first_name: "Joe" },
      chat: { id: "some_chat_id" },
      text: "/movieyear somefilmname 1989",
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
        mockMovieWithInfo();
      }
    );

    and("there is no trailer for the film", () => {
      mockNoTrailer();
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
        mockMovieWithInfo();
      }
    );

    and("there is a trailer for the film", () => {
      mockMovieWithTrailer();
    });

    when("the command is executed", async () => {
      await response(command, mockApi, state);
    });

    then(
      "the response should contain the title, information and trailer",
      () => {
        const responseWithTitleInformationAndTrailer: string =
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
      command = movieCommand;
    });

    and("the omdb is unvailable", () => {
      mockOmdbUnavailable();
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
        mockMovieWithInfo();
      }
    );

    and("youtube is unvailable", () => {
      mockYoutubeUnavailable();
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

  test("Responding to a movie where the title without a trailer is the only available information", ({
    given,
    and,
    when,
    then,
  }) => {
    given("an incoming message prefixed with movie", () => {
      command = movieCommand;
    });

    and("there is only a title available for the film", () => {
      jest.spyOn(fetcher, "fetcher").mockResolvedValueOnce(filmNoInfo);
    });

    and("there is no trailer for the film", () => {
      mockNoTrailer();
    });

    when("the command is executed", async () => {
      await response(command, mockApi, state);
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
      command = movieCommand;
    });

    and("there is only a title available for the film", () => {
      jest.spyOn(fetcher, "fetcher").mockResolvedValueOnce(filmNoInfo);
    });

    and("there is a trailer for the film", () => {
      mockMovieWithTrailer();
    });

    when("the command is executed", async () => {
      await response(command, mockApi, state);
    });

    then("the response should contain the movie name only", () => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text:
          "Movie: Finding Nemo\n\nhttps://www.youtube.co.uk/watch?v=movieId",
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
      command = movieCommand;
    });

    and("there is no title available for the film", () => {
      jest.spyOn(fetcher, "fetcher").mockResolvedValueOnce(movieNoTitle);
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
});
