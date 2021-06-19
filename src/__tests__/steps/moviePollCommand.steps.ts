import {
  mockMovieWithInfo,
  mockSendMessage,
  mockSendPoll,
  runMessageHandler,
} from "../../__mocks__/movies";

import { State } from "../../State/State";

import { defineFeature, loadFeature } from "jest-cucumber";
import { MessageType } from "../../__mocks__/messages";
import { MoviePollResponse } from "../../types";

const feature = loadFeature(
  "./src/__tests__/features/moviePollCommand.feature"
);

const mockPollResponse: MoviePollResponse = {
  chat: { username: "some-user-name" },
  poll: {
    id: "some-id",
    options: ["option one", "option two"],
    total_voter_count: 0,
  },
};

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test("Minimum number of movies", ({ given, when, then }) => {
    let state: State;

    given(
      /^I have selected a (.*) movies fewer than the minimum required$/,
      async (numberOfMovies: number) => {
        state = new State();

        let counter = numberOfMovies;
        while (counter > 0) {
          mockMovieWithInfo();
          await runMessageHandler(MessageType.SET_MOVIE, state);
          counter--;
        }
      }
    );

    when("I send the moviepoll command", async () => {
      await runMessageHandler(MessageType.MOVIEPOLL, state, mockPollResponse);
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
          mockMovieWithInfo();
          await runMessageHandler(MessageType.SET_MOVIE, state);
          counter--;
        }
      }
    );

    when("I send the moviepoll command", async () => {
      await runMessageHandler(MessageType.MOVIEPOLL, state, mockPollResponse);
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

  test("Movies larger than telegram limit", ({ given, when, then }) => {
    let state: State;
    let numberOfPolls = 0;
    given(
      /^I have selected a (.*) movies greater than the telegram limit$/,
      async (numberOfMovies: number) => {
        numberOfPolls = Math.ceil(numberOfMovies / 10);
        state = new State();
        let counter = numberOfMovies;
        while (counter > 0) {
          state.movies.push({ Title: "some movie" });
          counter--;
        }
      }
    );

    when("I send the moviepoll command", async () => {
      await runMessageHandler(
        MessageType.MOVIEPOLL,
        state,
        mockPollResponse,
        false
      );
    });

    then("I receive as many polls as needed", () => {
      expect(mockSendPoll).toHaveBeenCalledTimes(numberOfPolls);
    });
  });
});
