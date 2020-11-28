import { IncomingMessage } from "../types";
import * as responseGenerator from "../responseGenerator/responseGenerator";


type ChatId = string | number;
export enum ResponseType {
  message = "message",
}

export const respond = (
  response: string,
  chatId: ChatId,
  type: ResponseType,
  api: any
) => {
  api.sendMessage({ chatId, text: response });
};

export const generateResponse = (message: IncomingMessage, api: any) => {
  // const response =
  //   "Movie: Taken (2008)\n\nRuntime: 90 min\nInternet Movie Database: 7.8/10\nRotten Tomatoes: 58%\nMetacritic: 51/100\n\nDirector: Pierre Morel\n\nPlot: A retired CIA agent travels across Europe and relies on his old skills to save his estranged daughter, who has been kidnapped while on a trip to Paris.";
  const chatId = message.message.chat.id;

  const { response, type } = responseGenerator.generate(message.message.text);

  respond(response, chatId, type, api);
};
