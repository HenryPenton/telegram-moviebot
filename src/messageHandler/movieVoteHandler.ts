import { State } from "../State/State";
import { optionsSelected } from "../types";

export const voteHandler = (
  state: State,
  movieVotes: optionsSelected,
  pollId: string
) => {
  state.updateVotesForPollId(movieVotes, pollId);
};
