import {
  mockApiWithPollResponse,
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
  "./src/__tests__/features/moviePollResponses.feature"
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

  test("A poll gets added to state", ({ given, and, when, then }) => {
    let state: State;
    given(
      "I have selected a number movies greater than the minimum",
      async () => {
        state = new State();
        mockMovieWithInfo();
        await runMessageHandler(MessageType.SET_MOVIE, state);
        mockMovieWithInfo();
        await runMessageHandler(MessageType.SET_MOVIE, state);
      }
    );

    when("I send the moviepoll command", async () => {
      await runMessageHandler(
        MessageType.MOVIEPOLL_WITH_RESPONSE,
        state,
        mockPollResponse
      );
    });

    then("The poll gets added to state", () => {
      expect(state.polls).toEqual([
        {
          id: "some-id",
          movies: ["option one", "option two"],
        },
      ]);
    });
  });

  test("A poll that has no response falls over gracefully", ({
    given,
    when,
    but,
    then,
  }) => {
    let state: State;

    given(
      "I have selected a number movies greater than the minimum",
      async () => {
        state = new State();
        mockMovieWithInfo();
        await runMessageHandler(MessageType.SET_MOVIE, state);
        mockMovieWithInfo();
        await runMessageHandler(MessageType.SET_MOVIE, state);
        mockSendMessage.mockReset(); //dont care about the mock calls from adding movies to state
      }
    );

    when("I send the moviepoll command", async () => {
      await runMessageHandler(
        MessageType.MOVIEPOLL_WITH_RESPONSE,
        state,
        mockPollResponse,
        true
      );
    });

    but("the response does not exist", () => {
      //configured above
    });

    then("The command falls over gracefully", () => {
      expect(state.polls).toEqual([]);
      expect(mockSendMessage).not.toHaveBeenCalled();
      expect(mockSendPoll).not.toHaveBeenCalled();
    });
  });
});
