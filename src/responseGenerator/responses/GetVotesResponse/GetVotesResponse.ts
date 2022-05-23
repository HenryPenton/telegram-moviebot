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
    let allVotes = "";

    let movieVotes = this.state.getPolls();

    movieVotes = movieVotes.sort((a, b) => b.voter_count - a.voter_count);

    for (let index = 0; index < movieVotes.length; index++) {
      const movieVote = movieVotes[index];
      const movieName = movieVote.text;
      const numberOfVotes = movieVote.voter_count;
      const pluralised = numberOfVotes > 1 ? "votes" : "vote";

      allVotes += `${movieName} has ${numberOfVotes} ${pluralised} \n`;
    }
    if (allVotes === "") {
      allVotes = "Could not find any votes";
    }
    return allVotes;
  };
}
