import { State } from "../../../State/State";
import { LocalResponse } from "../LocalResponse";

export class GetVotesResponse extends LocalResponse {
  response: string;
  constructor(state: State) {
    super(state);
    this.response = this.getVotes();
  }

  generateResponse = (): string => this.response;

  getVotes = (): string => {
    const movieVotes = this.state
      .getPolls()
      .sort((a, b) => b.voter_count - a.voter_count);

    if (movieVotes.length === 0) return "Could not find any votes";

    let currentMaxVote = 0;
    let allVotes = "";

    for (let index = 0; index < movieVotes.length; index++) {
      const { text, voter_count } = movieVotes[index];
      const numberOfVotes = voter_count;

      if (numberOfVotes === 0) continue;

      const movieName = text;
      const pluralised = numberOfVotes > 1 ? "votes" : "vote";

      if (currentMaxVote !== voter_count) {
        currentMaxVote = voter_count;
        allVotes += `<b><u>${currentMaxVote} ${pluralised}:</u></b> \n`;
      }

      allVotes += `${movieName} \n`;
    }

    return allVotes;
  };
}
