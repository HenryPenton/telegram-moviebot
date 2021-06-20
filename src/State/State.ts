import { Movie, MovieVote, optionsSelected, Poll } from "../types";
import { getMovieRatings } from "../utils/getMovieRatings";
import { removeFromArray } from "../utils/removeFromArray";

export class State {
  movies: Movie[];
  polls: Poll[];

  constructor() {
    this.movies = [];
    this.polls = [];
  }
  updateVotesForPollId = (
    movieVotes: optionsSelected,
    pollId: string,
    username: string
  ) => {
    const poll = this.polls.find((poll) => poll.id === pollId);

    if (poll) {
      if (movieVotes.length === 0) {
        poll.movieVotes.forEach((movieVote) => {
          removeFromArray<string>(movieVote.votes, username);
        });
      } else {
        movieVotes.forEach((movieVote) => {
          poll.movieVotes[movieVote].votes.push(username);
        });
      }
    }
  };

  getPolls = () => this.polls;

  setPoll = (poll: Poll) => this.polls.push(poll);

  wipePolls = () => (this.polls = []);

  setMovie = (movie: Movie) => this.movies.push(movie);

  getMovies = (): string[] => {
    return this.movies.map(
      (movie) =>
        `${
          movie.Ratings
            ? `${movie.Title} ${getMovieRatings(movie)}`
            : movie.Title
        }`
    );
  };

  removies = () => (this.movies = []);

  removie = (id: number): string | undefined => {
    const zeroizedId = id - 1;
    const movie = this.movies[zeroizedId];

    const newMovieArray = this.movies.filter(
      (_, index) => index !== zeroizedId
    );
    this.movies = newMovieArray;
    if (movie) {
      return movie.Title;
    }
  };

  makeUnique = () => {
    const uniqueMovies: Movie[] = [];
    const uniqueMovieTitles: string[] = [];

    this.movies.forEach((movie) => {
      if (movie.imdbID) {
        if (!uniqueMovieTitles.includes(movie.imdbID)) {
          uniqueMovies.push(movie);
          uniqueMovieTitles.push(movie.imdbID);
        }
      } else {
        uniqueMovies.push(movie);
      }
    });

    this.movies = uniqueMovies;
  };
}
