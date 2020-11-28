import Fetcher from "../Fetcher/Fetcher";
import  * as MessageHandler from "../messageHandler/messageHandler";
import { IncomingMessage } from "../types";

describe("the message handler", () => {
  test("should fire a message with a poll when that is the command and there are enough movies set", () => {});
  test("should fire a message with a short version of the movies set when someone asks for the set options", () => {});
  test("should fire a message with the film name when someone sets a movie", () => {});

  describe("movie command", () => {
    test.only("should fire a message with the film plus info plus the trailer when someone queries a film", () => {
   
      const mockIncomingMessageOne: IncomingMessage = {
        message: {
          from: { first_name: "Joe" },
          chat: { id: "some_chat_id" },
          text: "/movie taken",
        },
      };

      const mockResponseOne: string =
        "Movie: Taken (2008)\n\nRuntime: 90 min\nInternet Movie Database: 7.8/10\nRotten Tomatoes: 58%\nMetacritic: 51/100\n\nDirector: Pierre Morel\n\nPlot: A retired CIA agent travels across Europe and relies on his old skills to save his estranged daughter, who has been kidnapped while on a trip to Paris.";

      const mockSendMessage = jest.fn();

      

      expect(mockSendMessage).toHaveBeenCalledWith(
        "some_chat_id",
        mockResponseOne
      );

      //I dont really care what the contents is -> a finding nemo taken crossover sounds fine to me
      const mockIncomingMessageTwo: IncomingMessage = {
        message: {
          from: { first_name: "Joe" },
          chat: { id: "some_chat_id" },
          text: "/movie finding nemo",
        },
      };

      const mockResponseTwo: string =
        "Movie: Finding Nemo (2003)\n\nRuntime: 90 min\nInternet Movie Database: 7.8/10\nRotten Tomatoes: 58%\nMetacritic: 51/100\n\nDirector: Pierre Morel\n\nPlot: A retired CIA agent travels across Europe and relies on his old skills to save his estranged daughter, who has been kidnapped while on a trip to Paris.";

      Handler = new MessageHandler(mockIncomingMessageTwo, jest.fn());
      jest.spyOn(Handler, "_sendMessage").mockImplementation(mockSendMessage);
      Handler.fire();

      expect(mockSendMessage).toHaveBeenLastCalledWith(
        "some_chat_id",
        mockResponseTwo
      );
    });
  });
});
