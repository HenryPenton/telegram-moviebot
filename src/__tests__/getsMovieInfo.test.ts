import * as messageHandler from "../messageHandler/messageHandler";
import * as fetcher from "../fetcher/fetcher";

import { ResponseType } from "../messageHandler/messageHandler";
import { IncomingMessage, Movie } from "../types";

import taken from "./testData/taken.json";
import nemo from "./testData/findingnemo.json";
// import nemo from "./findingnemo.json";

describe("the message handler", () => {
  describe("movie command", () => {
    test.only("should fire a message with the film plus info plus the trailer when someone queries a film", async () => {
      const mockIncomingMessageOne: IncomingMessage = {
        message: {
          from: { first_name: "Joe" },
          chat: { id: "some_chat_id" },
          text: "/movie taken",
        },
      };

      const mockSendMessage = jest.fn();

      jest.spyOn(messageHandler, "respond").mockImplementation(mockSendMessage);
      jest.spyOn(fetcher, "getMovie").mockResolvedValueOnce(taken);
      jest
        .spyOn(fetcher, "getTrailer")
        .mockResolvedValueOnce("www.trailers.co.uk");

      const mockResponseOne: string =
        "Movie: Taken (2008)\n\nRuntime: 90 min\n\nInternet Movie Database: 7.8/10\nRotten Tomatoes: 58%\nMetacritic: 51/100\n\nDirector: Pierre Morel\n\nPlot: A retired CIA agent travels across Europe and relies on his old skills to save his estranged daughter, who has been kidnapped while on a trip to Paris.\n\nwww.trailers.co.uk";

      await messageHandler.generateResponse(mockIncomingMessageOne, "fake api");

      expect(mockSendMessage).toHaveBeenCalledWith(
        mockResponseOne,
        "some_chat_id",
        ResponseType.message,
        "fake api"
      );
      mockSendMessage.mockReset();

      jest.spyOn(fetcher, "getMovie").mockResolvedValueOnce(nemo);
      jest.spyOn(fetcher, "getTrailer").mockResolvedValueOnce("");

      const mockIncomingMessageTwo: IncomingMessage = {
        message: {
          from: { first_name: "Juergen" },
          chat: { id: "some_chat_id" },
          text: "/movie finding nemo",
        },
      };

      const mockResponseTwo: string =
        "Movie: Finding Nemo (2003)\n\nRuntime: 100 min\n\nInternet Movie Database: 8.1/10\nRotten Tomatoes: 99%\nMetacritic: 90/100\n\nDirector: Andrew Stanton, Lee Unkrich(co-director)\n\nPlot: After his son is captured in the Great Barrier Reef and taken to Sydney, a timid clownfish sets out on a journey to bring him home.";

      await messageHandler.generateResponse(mockIncomingMessageTwo, "fake api");

      expect(mockSendMessage).toHaveBeenCalledWith(
        mockResponseTwo,
        "some_chat_id",
        ResponseType.message,
        "fake api"
      );
    });
  });
});
