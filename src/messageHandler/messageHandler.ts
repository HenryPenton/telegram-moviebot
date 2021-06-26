import {
  IncomingMessage,
  MoviePollId,
  MoviePollResponse,
  Option,
  optionsSelected,
  Poll,
} from "../types";
import * as responseGenerator from "../responseGenerator/responseGenerator";
import { State } from "../State/State";
import { open } from "object_opener";
import { voteHandler } from "./movieVoteHandler";

type ChatId = string | number;

export enum ResponseType {
  message = "message",
  moviePoll = "moviePoll",
  none = "none",
}

const respondWithMessage = (
  chatId: ChatId,
  api: any,
  response?: responseGenerator.Response
): void => {
  api.sendMessage({ chat_id: chatId, text: response });
};

const respondWithPoll = async (
  chatId: ChatId,
  api: any,
  state: State,
  pollResponses: responseGenerator.PollResponse
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
  api: any,
  state: State,
  response?: responseGenerator.Response
): Promise<void> => {
  if (type === ResponseType.message) {
    respondWithMessage(chatId, api, response);
  } else if (type === ResponseType.moviePoll) {
    const pollResponses = response as responseGenerator.PollResponse;

    await respondWithPoll(chatId, api, state, pollResponses);
  }
};

export const generateResponse = async (
  message: IncomingMessage,
  api: any,
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
    const { response, type } = await responseGenerator.generate(
      messageText,
      state
    );
    await respond(chatId, type, api, state, response);
  }
};
