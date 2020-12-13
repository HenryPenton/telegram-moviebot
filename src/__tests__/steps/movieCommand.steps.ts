import * as messageHandler from "../../messageHandler/messageHandler";
import * as fetcher from "../../fetcher/fetcher";
import * as movieFetcher from "../../fetcher/movie/movieFetcher";
import * as trailerFetcher from "../../fetcher/trailer/trailerFetcher";

import taken from "../testData/taken.json";
import movieNoTitle from "../testData/movieWithoutTitle.json";
import nemo from "../testData/findingnemo.json";
import nemoNoInfo from "../testData/findingnemoNoInfo.json";
import { State } from "../../State/State";

import { defineFeature, loadFeature } from "jest-cucumber";
import { IncomingMessage } from "../../types";

const feature = loadFeature("./src/__tests__/features/movieCommand.feature");

defineFeature(feature, (test) => {
  const state = new State();

  const mockSendMessage = jest.fn(() => {});
  const mockApi = { sendMessage: mockSendMessage };
  beforeEach(() => {
    mockSendMessage.mockReset();
  });

  const movieResponse: string =
    "Movie: Taken (2008)\n\nRuntime: 90 min\n\nInternet Movie Database: 7.8/10\nRotten Tomatoes: 58%\nMetacritic: 51/100\n\nDirector: Pierre Morel\n\nPlot: A retired CIA agent travels across Europe and relies on his old skills to save his estranged daughter, who has been kidnapped while on a trip to Paris.";

  const movieCommand: IncomingMessage = {
    message: {
      from: { first_name: "Joe" },
      chat: { id: "some_chat_id" },
      text: "/movie taken",
    },
  };
  test("Getting a movie with info", async ({ given, and, then, when }) => {
    let command;
    given("an incoming message prefixed with movie", () => {
      command = movieCommand;
    });

    and(
      "the movie response has a title and other information about the film",
      () => {
        jest.spyOn(movieFetcher, "getMovie").mockResolvedValueOnce(taken);
      }
    );

    and("there is a trailer for the film", () => {
      jest.spyOn(trailerFetcher, "getTrailer").mockResolvedValueOnce("");
    });

    when("the command is executed", async () => {
      await messageHandler.generateResponse(command, mockApi, state);
    });

    then(
      "the response should contain the title, information and trailer",
      () => {
        expect(mockSendMessage).toHaveBeenCalledWith({
          chat_id: "some_chat_id",
          text: movieResponse,
        });
      }
    );
  });
});
