import { State } from "../State/State";
import { optionsSelected } from "../types";

export const voteHandler = (
  state: State,
  movieVotes: optionsSelected,
  pollId: string,
  username: string
): void => {
  state.updateVotesForPollId(movieVotes, pollId, username);
};
