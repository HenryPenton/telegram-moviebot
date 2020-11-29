import * as messageHandler from "../messageHandler/messageHandler";
import * as fetcher from "../fetcher/fetcher";

import { ResponseType } from "../messageHandler/messageHandler";
import { IncomingMessage } from "../types";

import taken from "./testData/taken.json";
import nemo from "./testData/findingnemo.json";

describe("the message handler", () => {
  describe("movie command", () => {
    const mockSendMessage = jest.fn();
    jest.spyOn(messageHandler, "respond").mockImplementation(mockSendMessage);
    beforeEach(() => {
      mockSendMessage.mockReset();
    });
    test("should fire a message with the film plus info when someone queries a film", async () => {
      const mockIncomingMessageOne: IncomingMessage = {
        message: {
          from: { first_name: "Joe" },
          chat: { id: "some_chat_id" },
          text: "/movie taken",
        },
      };

      jest.spyOn(fetcher, "getMovie").mockResolvedValueOnce(taken);
      jest.spyOn(fetcher, "getTrailer").mockResolvedValueOnce("");

      const mockResponseOne: string =
        "Movie: Taken (2008)\n\nRuntime: 90 min\n\nInternet Movie Database: 7.8/10\nRotten Tomatoes: 58%\nMetacritic: 51/100\n\nDirector: Pierre Morel\n\nPlot: A retired CIA agent travels across Europe and relies on his old skills to save his estranged daughter, who has been kidnapped while on a trip to Paris.";

      await messageHandler.generateResponse(mockIncomingMessageOne, "fake api");

      expect(mockSendMessage).toHaveBeenCalledWith(
        mockResponseOne,
        "some_chat_id",
        ResponseType.message,
        "fake api"
      );
    });
    test("should fire a message with the film plus info plus the trailer (if available) when someone queries a film", async () => {
      jest.spyOn(fetcher, "getMovie").mockResolvedValueOnce(nemo);
      jest
        .spyOn(fetcher, "getTrailer")
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

      await messageHandler.generateResponse(mockIncomingMessageTwo, "fake api");

      expect(mockSendMessage).toHaveBeenCalledWith(
        mockResponseTwo,
        "some_chat_id",
        ResponseType.message,
        "fake api"
      );
    });
    // test("should respond with unknown movie if the call to omdb fails", async () => {
    //   jest.spyOn(fetcher, "getMovie").mockRejectedValueOnce("some error");

    //   const mockIncomingMessageTwo: IncomingMessage = {
    //     message: {
    //       from: { first_name: "Henry" },
    //       chat: { id: "some_chat_id" },
    //       text: "/movie not_a_film",
    //     },
    //   };

    //   // const mockResponseTwo: string = "Unknown movie";

    //   await messageHandler.generateResponse(mockIncomingMessageTwo, "fake api");

    //   // expect(mockSendMessage).toHaveBeenCalledWith(
    //   //   mockResponseTwo,
    //   //   "some_chat_id",
    //   //   ResponseType.message,
    //   //   "fake api"
    //   // );
    // });
    // test("should respond with the film and no trailer if the call to youtube fails", () => {});
  });
});
