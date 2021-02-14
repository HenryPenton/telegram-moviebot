import {
  getMessageHandlerResponse,
  mockMovieWithYear,
  mockSendMessage,
} from "../../__mocks__/movies";
import { loadFeature, defineFeature } from "jest-cucumber";
import { State } from "../../State/State";

import { MessageType } from "../../__mocks__/messages";

const feature = loadFeature("./src/__tests__/features/getAndSetMovie.feature");

defineFeature(feature, (test) => {
  let state: State;
  test("Set a movie using the setmovieyear command", ({
    given,
    when,
    then,
  }) => {
    state = new State();

    given("A setmovieyear command", () => {
      mockMovieWithYear();
    });

    when("the command is executed", async () => {
      await getMessageHandlerResponse(MessageType.SET_MOVIE_WITH_YEAR, state);
    });

    then("the movie is set", () => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: "Taken (IMDb Rating: 7.8/10) added to the film selection",
      });
    });
  });
});
