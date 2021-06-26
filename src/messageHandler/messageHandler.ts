import { MoviePollId, Poll, State } from "../State/State";
import { open } from "object_opener";
import { voteHandler } from "./movieVoteHandler";
import {
  generate,
  MessageResponse,
  PollResponse,
  Response,
} from "../responseGenerator/responseGenerator";

type Option = { text: string };

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

type ChatId = string | number;

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

const respondWithMessage = (
  chatId: ChatId,
  api: TelegramApi,
  response?: MessageResponse
): void => {
  api.sendMessage({ chat_id: chatId, text: response });
};

const respondWithPoll = async (
  chatId: ChatId,
  api: TelegramApi,
  state: State,
  pollResponses: PollResponse
): Promise<void> => {
  state.resetPolls();
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
      const pollResponseId: MoviePollId = open(pollResponse, "poll.id");
      const pollOptions: Option[] = open(pollResponse, "poll.options");
      if (pollOptions && pollResponseId) {
        const pollToSet: Poll = {
          id: pollResponseId,
          movieVotes: pollOptions.map((option) => ({
            movie: option.text,
            votes: [],
          })),
        };
        state.setPoll(pollToSet);
      }
    } catch (e) {
      console.error(e);
    }
  }
};

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
