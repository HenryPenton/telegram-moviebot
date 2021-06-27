import { MoviePollId, State } from "../State/State";
import { open } from "object_opener";
import { voteHandler } from "./movieVoteHandler";
import {
  generate,
  MessageResponse,
  PollResponse,
  Response,
} from "../responseGenerator/responseGenerator";
import { respondWithPoll } from "./response/pollResponse";
import { respondWithMessage } from "./response/messageResponse";

export type Option = { text: string };

export type IncomingMessage = {
  message?: {
    from: { first_name: string };
    chat: { id?: string | number };
    text: string;
  };

  poll_answer?: {
    poll_id: MoviePollId;
    user: {
      username: string;
      id: number;
    };
    option_ids: optionsSelected;
  };
};

export type ChatId = string | number;

export enum ResponseType {
  message = "message",
  moviePoll = "moviePoll",
  none = "none",
}

export type optionsSelected = number[];

export type MoviePollResponse = {
  chat: {
    username: string;
  };
  poll: {
    id: MoviePollId;
    options: Option[];
    total_voter_count: 0;
  };
};

type SendMessage = {
  chat_id: ChatId;
  text?: MessageResponse;
};

type SendPoll = {
  chat_id: ChatId;
  question: string;
  options: string[];
  allows_multiple_answers: "true" | "false";
  is_anonymous: "true" | "false";
};

export interface TelegramApi {
  sendMessage: ({ chat_id, text }: SendMessage) => void;
  sendPoll: ({
    chat_id,
    question,
    options,
    allows_multiple_answers,
    is_anonymous,
  }: SendPoll) => Promise<MoviePollResponse>;
}

export const respond = async (
  chatId: ChatId,
  type: ResponseType,
  api: TelegramApi,
  state: State,
  response: Response
): Promise<void> => {
  if (type === ResponseType.message) {
    respondWithMessage(chatId, api, response as MessageResponse);
  } else if (type === ResponseType.moviePoll) {
    const pollResponses = response as PollResponse;

    await respondWithPoll(chatId, api, state, pollResponses);
  }
};

export const generateResponse = async (
  message: IncomingMessage,
  api: TelegramApi,
  state: State
): Promise<void> => {
  const chatId: ChatId = open(message, "message.chat.id");
  const messageText: string = open(message, "message.text");

  const movieVotes: optionsSelected = open(message, "poll_answer.option_ids");
  const pollId: MoviePollId = open(message, "poll_answer.poll_id");
  const userid: number = open(message, "poll_answer.user.id");

  if (movieVotes && pollId && userid) {
    const username = userid.toString();
    voteHandler(state, movieVotes, pollId, username);
  }

  if (chatId && messageText) {
    const { response, type } = await generate(messageText, state);
    await respond(chatId, type, api, state, response);
  }
};
