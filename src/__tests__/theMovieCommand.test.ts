import * as messageHandler from "../messageHandler/messageHandler";
import * as fetcher from "../fetcher/fetcher";
import * as movieFetcher from "../fetcher/movie/movieFetcher";
import * as trailerFetcher from "../fetcher/trailer/trailerFetcher";

import { IncomingMessage } from "../types";

import taken from "./testData/taken.json";
import movieNoTitle from "./testData/movieWithoutTitle.json";
import nemo from "./testData/findingnemo.json";
import nemoNoInfo from "./testData/findingnemoNoInfo.json";
import { State } from "../State/State";

describe("movie command", () => {
  const state = new State();
  const mockSendMessage = jest.fn(() => {});
  const mockApi = { sendMessage: mockSendMessage };
  beforeEach(() => {
    mockSendMessage.mockReset();
  });
  
 
  test("should respond with the film name and no other info if the info is not available", async () => {
    jest.spyOn(fetcher, "fetcher").mockResolvedValueOnce(nemoNoInfo);

    const mockIncomingMessageTwo: IncomingMessage = {
      message: {
        from: { first_name: "Henry" },
        chat: { id: "some_chat_id" },
        text: "/movie not_a_film",
      },
    };

    const mockResponseTwo: string = "Movie: Finding Nemo";

    await messageHandler.generateResponse(
      mockIncomingMessageTwo,
      mockApi,
      state
    );

    expect(mockSendMessage).toHaveBeenCalledWith({
      chat_id: "some_chat_id",
      text: mockResponseTwo,
    });
  });

  test("should respond with cant find the film if the film title doesnt exist", async () => {
    jest.spyOn(fetcher, "fetcher").mockResolvedValueOnce(movieNoTitle);

    const mockIncomingMessageTwo: IncomingMessage = {
      message: {
        from: { first_name: "Henry" },
        chat: { id: "some_chat_id" },
        text: "/movie not_a_film",
      },
    };

    const mockResponseTwo: string = "Unknown movie";

    await messageHandler.generateResponse(
      mockIncomingMessageTwo,
      mockApi,
      state
    );

    expect(mockSendMessage).toHaveBeenCalledWith({
      chat_id: "some_chat_id",
      text: mockResponseTwo,
    });
  });
});
