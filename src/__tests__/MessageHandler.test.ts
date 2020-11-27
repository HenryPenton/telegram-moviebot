import { MessageHandler } from "../MessageHandler/MessageHandler";
import { IncomingMessage } from "../types";

describe("the message handler", () => {
  test("should fire a message with a poll when that is the command and there are enough movies set", () => {});
  test("should fire a message with a short version of the movies set when someone asks for the set options", () => {});
  test("should fire a message with the film name when someone sets a movie", () => {});
  test("should fire a message with the film plus info plus the trailer when someone queries a film", () => {
    const mockIncomingMessage: IncomingMessage = {
      message: {
        from: { first_name: "Joe" },
        chat: { id: "some_chat_id" },
        text: "/movie taken",
      },
    };

    const mockResponse: string =
      "Movie: Taken (2008)\n\nRuntime: 90 min\nInternet Movie Database: 7.8/10\nRotten Tomatoes: 58%\nMetacritic: 51/100\n\nDirector: Pierre Morel\n\nPlot: A retired CIA agent travels across Europe and relies on his old skills to save his estranged daughter, who has been kidnapped while on a trip to Paris.";

    const mockSendMessage = jest.fn();

    const Handler = new MessageHandler(mockIncomingMessage, jest.fn());
    jest.spyOn(Handler, "sendMessage").mockImplementation(mockSendMessage);

    Handler.fire();

    expect(mockSendMessage).toHaveBeenCalledWith(mockResponse, "some_chat_id");
  });
});
