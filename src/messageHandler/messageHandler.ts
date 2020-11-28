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
  api.sendMessage({ chat_id: chatId, text: response });
};

export const generateResponse = async (message: IncomingMessage, api: any) => {
  const chatId = message.message.chat.id;

  const { response, type } = await responseGenerator.generate(
    message.message.text
  );

  if (response !== "") {
    respond(response, chatId, type, api);
  }
};
