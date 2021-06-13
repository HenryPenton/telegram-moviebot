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
  const commonMovieProperties: Movie = {
    Title: "Finding Nemo",
    Year: "2003",
    Rated: "G",
    Released: "30 May 2003",
    Runtime: "100 min",
    Genre: "Animation, Adventure, Comedy, Family",
    Director: "Andrew Stanton, Lee Unkrich(co-director)",
    Writer:
      "Andrew Stanton (original story by), Andrew Stanton (screenplay by), Bob Peterson (screenplay by), David Reynolds (screenplay by)",
    Actors: "Albert Brooks, Ellen DeGeneres, Alexander Gould, Willem Dafoe",
    Plot: "After his son is captured in the Great Barrier Reef and taken to Sydney, a timid clownfish sets out on a journey to bring him home.",
    Language: "English",
    Country: "USA",
    Awards: "Won 1 Oscar. Another 47 wins & 63 nominations.",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZTAzNWZlNmUtZDEzYi00ZjA5LWIwYjEtZGM1NWE1MjE4YWRhXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    Ratings: [{ Source: "some-source", Value: "some-value" }],
    Response: "True",
  };
  const movie: Movie = {
    ...commonMovieProperties,
    imdbID: "tt0266543",
  };
  const movieWithoutId: Movie = {
    ...commonMovieProperties,
  };

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

  test("Movies without an id", ({ given, when, then }) => {
    state = new State();
    given("the selection has multiple movies without ids", () => {
      state.movies = [movieWithoutId, movieWithoutId];
    });

    when("the cleanup command is sent", async () => {
      await runMessageHandler(MessageType.CLEANUP, state);
    });

    then("nothing is removed", () => {
      expect(state.movies).toEqual([movieWithoutId, movieWithoutId]);
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: "Duplicates in the movie selection have been removed",
      });
    });
  });
});
