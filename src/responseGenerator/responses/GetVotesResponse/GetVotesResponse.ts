import { MovieVotes, State } from "../../../State/State";
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
    let movieVotes: MovieVotes = [];
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
      const movieName = movieVote.movie;
      const numberOfVotes = movieVote.votes.length;
      const pluralised = numberOfVotes > 1 ? "votes" : "vote";

      allVotes += `${movieName} has ${numberOfVotes} ${pluralised} \n`;
    }
    if (allVotes === "") {
      allVotes = "Could not find any votes";
    }
    return allVotes;
  };
}
