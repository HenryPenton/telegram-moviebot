import { ResponseType } from "../../../messageHandler/messageHandler";
import { State } from "../../../State/State";
import { MovieVote } from "../../../types";
import { LocalResponse } from "../LocalResponse";

export class GetVotesResponse extends LocalResponse {
  response: string;
  constructor(state: State) {
    super(state);
    this.response = this.getVotes();
  }

  generateResponse = () => this.response;

  getVotes = () => {
    let allVotes = "";
    let movieVotes: MovieVote[] = [];
    const polls = this.state.getPolls();
    for (let index = 0; index < polls.length; index++) {
      const poll = polls[index];

      for (
        let movieIndex = 0;
        movieIndex < poll.movieVotes.length;
        movieIndex++
      ) {
        const movie = poll.movieVotes[movieIndex];
        if (movie.votes.length > 0) {
          movieVotes.push(movie);
        }
      }
    }

    movieVotes = movieVotes.sort((a, b) => b.votes.length - a.votes.length);

    for (let index = 0; index < movieVotes.length; index++) {
      const movieVote = movieVotes[index];
      allVotes += `${movieVote.movie} has ${movieVote.votes.length} votes \n`;
    }
    if (allVotes === "") {
      allVotes = "Could not find any votes";
    }
    return allVotes;
  };

  getType = () => ResponseType.message;
}
