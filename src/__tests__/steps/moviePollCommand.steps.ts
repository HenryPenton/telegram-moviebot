import {
  mockMovieWithInfo,
  mockSendMessage,
  mockSendPoll,
  runMessageHandler,
} from "../../__mocks__/movies";

import { State } from "../../State/State";

import { defineFeature, loadFeature } from "jest-cucumber";
import { MessageType } from "../../__mocks__/messages";

const feature = loadFeature(
  "./src/__tests__/features/moviePollCommand.feature"
);

defineFeature(feature, (test) => {
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
      await runMessageHandler(MessageType.MOVIEPOLL, state);
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
      await runMessageHandler(MessageType.MOVIEPOLL, state);
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
