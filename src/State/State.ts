import { Movie } from "../fetcher/movie/movieFetcher";
import { optionsSelected } from "../messageHandler/messageHandler";
import { getMovieRatings } from "../utils/getMovieRatings";
import { removeFromArray } from "../utils/removeFromArray";

export type MovieVote = { movie: string; votes: string[] };
export type MovieVotes = MovieVote[];

export type MoviePollId = string;

export interface Poll {
  id: MoviePollId;
  movieVotes: MovieVotes;
}

export class State {
  movies: Movie[];
  polls: Poll[];

  constructor() {
    this.movies = [];
    this.polls = [];
  }
  updateVotesForPollId = (
    userVotes: optionsSelected,
    pollId: string,
    voterIdentifier: string
  ): void => {
    const poll = this.polls.find((poll) => poll.id === pollId);

    if (poll) {
      if (userVotes.length === 0) {
        poll.movieVotes.forEach((movieVote) => {
          removeFromArray<string>(movieVote.votes, voterIdentifier);
        });
      } else {
        userVotes.forEach((userVote) => {
          poll.movieVotes[userVote].votes.push(voterIdentifier);
        });
      }
    }
  };

  getPolls = (): Poll[] => this.polls;

  resetPolls = (): void => {
    this.polls = [];
  };

  setPoll = (poll: Poll): void => {
    this.polls.push(poll);
  };

  setMovie = (movie: Movie): void => {
    this.movies.push(movie);
  };

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

  removies = (): void => {
    this.movies = [];
  };

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

  makeUnique = (): void => {
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
