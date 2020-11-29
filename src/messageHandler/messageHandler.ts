import { IncomingMessage } from "../types";
import * as responseGenerator from "../responseGenerator/responseGenerator";
import { State } from "../State/State";
import { open } from "object_opener";

type ChatId = string | number;

export enum ResponseType {
  message = "message",
  moviePoll = "moviePoll",
  none = "none",
}

export const respond = (
  response: string | string[],
  chatId: ChatId,
  type: ResponseType,
  api: any
) => {
  if (type === ResponseType.message) {
    api.sendMessage({ chat_id: chatId, text: response });
  } else if (type === ResponseType.moviePoll) {
    api.sendPoll({
      chat_id: chatId,
      question: "New week new movies",
      options: response as String[],
      allows_multiple_answers: "true",
      is_anonymous: "false",
    });
  }
};

export const generateResponse = async (
  message: IncomingMessage,
  api: any,
  state: State
) => {
  const chatId = open(message, "message.chat.id");
  if (chatId) {
    const messageText = open(message, "message.text");
    if (messageText) {
      const { response, type } = await responseGenerator.generate(
        messageText,
        state
      );

      if (response !== "") {
        respond(response, chatId, type, api);
      }
    }
  }
};
