import * as messageHandler from "../../messageHandler/messageHandler";
import * as fetcher from "../../fetcher/fetcher";
import { mockApi, mockSendMessage, mockSendPoll } from "../../__mocks__/movies";

import film from "../testData/taken.json";
import { State } from "../../State/State";

import { defineFeature, loadFeature } from "jest-cucumber";
import { IncomingMessage } from "../../types";

const feature = loadFeature(
  "./src/__tests__/features/moviePollCommand.feature"
);

defineFeature(feature, (test) => {
  const mockMovieResponse = () => {
    jest.spyOn(fetcher, "fetcher").mockResolvedValueOnce(film);
  };

  const mockMoviePollCommand: IncomingMessage = {
    message: {
      from: { first_name: "Joe" },
      chat: { id: "some_chat_id" },
      text: "/moviepoll",
    },
  };
  const mockSetAMovieMessage: IncomingMessage = {
    message: {
      from: { first_name: "Joe" },
      chat: { id: "some_chat_id" },
      text: "/setmovie some_movie",
    },
  };

  test("Minimum number of movies", ({ given, when, then }) => {
    let state: State;

    given(
      /^I have selected a (.*) movies fewer than the minimum required$/,
      async (numberOfMovies: number) => {
        state = new State();

        let counter = numberOfMovies;
        while (counter > 0) {
          mockMovieResponse();
          await messageHandler.generateResponse(
            mockSetAMovieMessage,
            mockApi,
            state
          );
          counter--;
        }
      }
    );

    when("I send the moviepoll command", async () => {
      await messageHandler.generateResponse(
        mockMoviePollCommand,
        mockApi,
        state
      );
    });

    then(/^I get a message saying "(.*)"$/, (error: string) => {
      expect(mockSendMessage).toHaveBeenLastCalledWith({
        chat_id: "some_chat_id",
        text: error,
      });
    });
  });

  test("Valid number of movies", ({ given, when, then }) => {
    let state: State;
    let options: string[];
    given(
      /^I have selected a (.*) movies greater than the minimum required$/,
      async (numberOfMovies: number) => {
        state = new State();
        options = [];
        let counter = numberOfMovies;
        while (counter > 0) {
          options.push("Taken (IMDb Rating: 7.8/10)");
          mockMovieResponse();
          await messageHandler.generateResponse(
            mockSetAMovieMessage,
            mockApi,
            state
          );
          counter--;
        }
      }
    );

    when("I send the moviepoll command", async () => {
      await messageHandler.generateResponse(
        mockMoviePollCommand,
        mockApi,
        state
      );
    });

    then("I receive a poll", () => {
      expect(mockSendPoll).toHaveBeenLastCalledWith({
        allows_multiple_answers: "true",
        chat_id: "some_chat_id",
        is_anonymous: "false",
        options,
        question: "New week new movies",
      });
    });
  });
});
