import { ResponseType } from "../../../messageHandler/messageHandler";
import { State } from "../../../State/State";
import { MovieVote } from "../../../types";
import { LocalResponse } from "../LocalResponse";

export class GetVotesResponse extends LocalResponse {
  constructor(state: State) {
    super(state);
  }

  generateResponse = () => this.getVotes();

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
        if (movie.votes > 0) {
          movieVotes.push(movie);
        }
      }
    }

    movieVotes = movieVotes.sort((a, b) => b.votes - a.votes);

    for (let index = 0; index < movieVotes.length; index++) {
      const movieVote = movieVotes[index];
      allVotes += `${movieVote.movie} has ${movieVote.votes} votes \n`;
    }

    return allVotes;
  };

  getType = () => ResponseType.message;
}
