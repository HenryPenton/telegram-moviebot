import { IncomingMessage } from "../types";
import * as responseGenerator from "../responseGenerator/responseGenerator";
import { State } from "../State/State";

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

export const generateResponse = async (
  message: IncomingMessage,
  api: any,
  state: State
) => {
  const chatId = message.message.chat.id;

  const { response, type } = await responseGenerator.generate(
    message.message.text,
    state
  );

  if (response !== "") {
    respond(response, chatId, type, api);
  }
};
