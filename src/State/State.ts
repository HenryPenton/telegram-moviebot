import { Movie, MovieVote, optionsSelected, Poll } from "../types";
import { getMovieRatings } from "../utils/getMovieRatings";

export class State {
  movies: Movie[];
  polls: Poll[];

  constructor() {
    this.movies = [];
    this.polls = [];
  }
  updateVotesForPollId = (movieVotes: optionsSelected, pollId: string) => {
    const poll = this.polls.find((poll) => poll.id === pollId);
    if (poll) {
      movieVotes.forEach((movieVote) => {
        poll.movieVotes[movieVote].votes++;
      });
    }
    // this.getVotes();
  };

  // getVotes = () => {
  //   let allVotes = "";
  //   for (let index = 0; index < this.polls.length; index++) {
  //     const poll = this.polls[index];

  //     for (
  //       let movieIndex = 0;
  //       movieIndex < poll.movieVotes.length;
  //       movieIndex++
  //     ) {
  //       const movie = poll.movieVotes[movieIndex];
  //       console.log(JSON.stringify(movie));
  //       allVotes += `${movie.movie.toString()} has ${movie.votes} votes \n`;
  //     }
  //   }
  //   console.log(allVotes);
  // };

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
