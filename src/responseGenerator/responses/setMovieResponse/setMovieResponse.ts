import { getMovie } from "../../../fetcher/movie/movieFetcher";

export const generateResponse = async (movieName: string) => {
  const movie = await getMovie(movieName);
  const successfulRequest = movie.Response === "True";
  const setMovieTitle = movie.Title;
  const completeResponse = `${setMovieTitle} added to the film selection`;

  let setMovieRating;
  if (movie.Ratings) {
    if (movie.Ratings.length > 0) {
      setMovieRating = `(${
        movie.Ratings[0].Source === "Internet Movie Database"
          ? "IMDb"
          : movie.Ratings[0].Source
      } Rating: ${movie.Ratings[0].Value})`;
    }
  }

  return { setMovieTitle, completeResponse, successfulRequest, setMovieRating };
};

export class SetMovieResponse {
  constructor() {}

  
}
