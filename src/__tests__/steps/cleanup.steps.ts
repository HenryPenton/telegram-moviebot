import {
  runMessageHandler,
  mockMovieWithInfo,
  mockSendMessage,
} from "../../__mocks__/movies";
import { loadFeature, defineFeature } from "jest-cucumber";
import { State } from "../../State/State";

import { MessageType } from "../../__mocks__/messages";
import { Movie } from "../../types";

const feature = loadFeature("./src/__tests__/features/cleanup.feature");

defineFeature(feature, (test) => {
  let state: State;
  const movie: Movie = { Title: "some movie title" };

  test("Cleanup duplicate movies", ({ given, when, then }) => {
    state = new State();
    given("the selection has two of the same movie in it", () => {
      state.movies = [movie, movie];
    });

    when("the cleanup command is sent", async () => {
      await runMessageHandler(MessageType.CLEANUP, state);
    });

    then("any duplicates in the selection are removed", () => {
      expect(state.movies).toEqual([movie]);
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: "Duplicates in the movie selection have been removed",
      });
    });
  });
});
