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
  
  test("should fire a message with the film plus info plus the trailer (if available) when someone queries a film", async () => {
    jest.spyOn(movieFetcher, "getMovie").mockResolvedValueOnce(nemo);
    jest
      .spyOn(trailerFetcher, "getTrailer")
      .mockResolvedValueOnce("www.trailers.co.uk/watch");

    const mockIncomingMessageTwo: IncomingMessage = {
      message: {
        from: { first_name: "Juergen" },
        chat: { id: "some_chat_id" },
        text: "/movie finding nemo",
      },
    };

    const mockResponseTwo: string =
      "Movie: Finding Nemo (2003)\n\nRuntime: 100 min\n\nInternet Movie Database: 8.1/10\nRotten Tomatoes: 99%\nMetacritic: 90/100\n\nDirector: Andrew Stanton, Lee Unkrich(co-director)\n\nPlot: After his son is captured in the Great Barrier Reef and taken to Sydney, a timid clownfish sets out on a journey to bring him home.\n\nwww.trailers.co.uk/watch";

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
  test("should respond with unknown movie if the call to omdb fails", async () => {
    jest.spyOn(fetcher, "fetcher").mockRejectedValueOnce("some error");

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
  test("should respond with the film and no trailer if the call to youtube fails", async () => {
    jest
      .spyOn(fetcher, "fetcher")
      .mockResolvedValueOnce(nemo)
      .mockRejectedValueOnce("some error");

    const mockIncomingMessageTwo: IncomingMessage = {
      message: {
        from: { first_name: "Henry" },
        chat: { id: "some_chat_id" },
        text: "/movie not_a_film",
      },
    };

    const mockResponseTwo: string =
      "Movie: Finding Nemo (2003)\n\nRuntime: 100 min\n\nInternet Movie Database: 8.1/10\nRotten Tomatoes: 99%\nMetacritic: 90/100\n\nDirector: Andrew Stanton, Lee Unkrich(co-director)\n\nPlot: After his son is captured in the Great Barrier Reef and taken to Sydney, a timid clownfish sets out on a journey to bring him home.";

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
