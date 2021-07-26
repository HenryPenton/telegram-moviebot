import {
  mockMovieWithInfo,
  mockSendMessage,
  mockSendPoll,
  runMessageHandler,
} from "../../__mocks__/movies";
import { State } from "../../State/State";
import { defineFeature, loadFeature } from "jest-cucumber";
import { MessageType } from "../../__mocks__/messages";
import { MoviePollResponse } from "../../messageHandler/messageHandler";

const feature = loadFeature(
  "./src/__tests__/features/moviePollCommand.feature"
);

const mockPollResponse: MoviePollResponse = {
  chat: { username: "some-user-name" },
  poll: {
    id: "12345",
    options: [{ text: "option one" }, { text: "option two" }],
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
          state.movies.push({
            imdbID: `${counter}-id`,
            Title: "Taken (IMDb Rating: 7.8/10)",
          });
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

  test("Only unique movies are sent", ({ given, but, when, then }) => {
    let state: State;
    given("I have selected three movies", () => {
      state = new State();
      state.setMovie({ Title: "option one", imdbID: "some-id-one" });
      //other two movies set below
    });

    but("two of them are duplicates", () => {
      state.setMovie({ Title: "option two", imdbID: "some-id-two" });
      state.setMovie({ Title: "option two", imdbID: "some-id-two" });
    });

    when("I send the moviepoll command", async () => {
      await runMessageHandler(
        MessageType.MOVIEPOLL,
        state,
        mockPollResponse,
        false
      );
    });

    then("I receive a poll with the two unique movies", () => {
      expect(mockSendPoll).toHaveBeenLastCalledWith({
        allows_multiple_answers: "true",
        chat_id: "some_chat_id",
        is_anonymous: "false",
        options: ["option one", "option two"],
        question: "New week new movies",
      });
    });
  });

  test("Sending one movie over the limit doesn't trigger minimum poll size error for the second poll", ({
    given,
    but,
    when,
    then,
    and,
  }) => {
    let state: State;
    given(/^I have selected (.*) movies$/, (numberOfMovies: number) => {
      state = new State();
      
      let counter = numberOfMovies;
      while (counter > 0) {
        state.setMovie({
          Title: `option ${counter}`,
          imdbID: `some-id-${counter}`,
        });

        counter--;
      }
    });

    but("the telegram limit is one less than that", () => {
      //defined by telegram
    });

    when("I send the moviepoll command", async () => {
      await runMessageHandler(
        MessageType.MOVIEPOLL,
        state,
        mockPollResponse,
        false
      );
    });

    then("I receive two polls", () => {
      expect(mockSendPoll).toHaveBeenCalledTimes(2);
    });

    and(
      /^they have lengths (.*) and (.*)$/,
      (firstPollLength: string, secondPollLength: string) => {
        expect(mockSendPoll.mock.calls[0][0].options).toHaveLength(
          parseInt(firstPollLength, 10)
        );

        expect(mockSendPoll.mock.calls[1][0].options).toHaveLength(
          parseInt(secondPollLength, 10)
        );
      }
    );
  });
});
