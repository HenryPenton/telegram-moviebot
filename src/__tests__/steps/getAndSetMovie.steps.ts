import * as messageHandler from "../../messageHandler/messageHandler";
import * as movieFetcher from "../../fetcher/movie/movieFetcher";

import filmWithInfo from "../testData/taken.json";
import { loadFeature, defineFeature } from "jest-cucumber";
import { State } from "../../State/State";
import { IncomingMessage } from "../../types";

const feature = loadFeature("./src/__tests__/features/getAndSetMovie.feature");

defineFeature(feature, (test) => {
  let state: State;
  const mockSendMessage = jest.fn(() => {});
  const mockApi = { sendMessage: mockSendMessage };
  beforeEach(() => {
    mockSendMessage.mockReset();
  });
  test("Set a movie using the setmovieyear command", ({
    given,
    when,
    then,
  }) => {
    state = new State();

    const mockIncomingMessageOne: IncomingMessage = {
      message: {
        from: { first_name: "Joe" },
        chat: { id: "some_chat_id" },
        text: "/setmovieyear some_movie 2003",
      },
    };

    given("A setmovieyear command", () => {
      jest
        .spyOn(movieFetcher, "getMovieWithYear")
        .mockResolvedValueOnce(filmWithInfo);
    });

    when("the command is executed", async () => {
      await messageHandler.generateResponse(
        mockIncomingMessageOne,
        mockApi,
        state
      );
    });

    then("the movie is set", () => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: "Taken (IMDb Rating: 7.8/10) added to the film selection",
      });
    });
  });
});
