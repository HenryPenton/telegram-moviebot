import { Movie } from "../fetcher/movie/movieFetcher";


export const getMovieRatings = (movie: Movie): string | undefined => {
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
  return setMovieRating;
};
