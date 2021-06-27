import { open } from "object_opener";
import { PollResponse } from "../../responseGenerator/responseGenerator";
import { State, MoviePollId, Poll } from "../../State/State";
import { TelegramApi, MoviePollResponse, ChatId, Option } from "../messageHandler";

export const respondWithPoll = async (
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