import { IncomingMessage, MoviePollResponse } from "../types";
import * as responseGenerator from "../responseGenerator/responseGenerator";
import { State } from "../State/State";
import { open } from "object_opener";

type ChatId = string | number;

export enum ResponseType {
  message = "message",
  moviePoll = "moviePoll",
  none = "none",
}

export const respond = async (
  chatId: ChatId,
  type: ResponseType,
  api: any,
  state: State,
  response?: responseGenerator.Response
) => {
  if (type === ResponseType.message) {
    api.sendMessage({ chat_id: chatId, text: response });
  } else if (type === ResponseType.moviePoll) {
    const pollResponses = response as responseGenerator.PollResponse;
    // state.wipePolls();
    for (let index = 0; index < pollResponses.length; index++) {
      const poll = pollResponses[index];
      try {
        const pollResponse: MoviePollResponse = await api.sendPoll({
          chat_id: chatId,
          question: "New week new movies",
          options: poll,
          allows_multiple_answers: "true",
          is_anonymous: "false",
        });

        state.setPoll(pollResponse.poll.id, pollResponse.poll.options);
      } catch {}
    }
  }
};

export const generateResponse = async (
  message: IncomingMessage,
  api: any,
  state: State
) => {
  const chatId: ChatId = open(message, "message.chat.id");
  const messageText: string = open(message, "message.text");

  if (chatId && messageText) {
    const { response, type } = await responseGenerator.generate(
      messageText,
      state
    );

    await respond(chatId, type, api, state, response);
  }
};
