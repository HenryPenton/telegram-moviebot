import { MessageResponse } from "../../responseGenerator/responseGenerator";
import { ChatId, TelegramApi } from "../messageHandler";

export const respondWithMessage = (
  chatId: ChatId,
  api: TelegramApi,
  response?: MessageResponse
): void => {
  api.sendMessage({ chat_id: chatId, text: response });
};
