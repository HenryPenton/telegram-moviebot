import { getMovie } from "../fetcher/movieFetcher";
import { getTrailer } from "../fetcher/trailerFetcher";
import {
  getTitleAndYear,
  getRuntime,
  getRatings,
  getDirector,
  getPlot,
} from "./infoGetters";

const infoAmalgamate = (infoArray: any[]) => {
  let info = "";
  infoArray.forEach((element, index) => {
    if (index === 0) {
      if (element !== "") {
        info = element;
      }
    } else if (element !== "") {
      info = `${info}\n\n${element}`;
    }
  });

  return info;
};

export const generateResponse = async (queryString: string) => {
  const movie = await getMovie(queryString);

  if (movie.Response === "False") return "Unknown movie";
  if (!movie.Title) return "Unknown movie";

  const movieDetails: string[] = [
    getTitleAndYear(movie.Title, movie.Year),
    getRuntime(movie.Runtime),
    getRatings(movie.Ratings),
    getDirector(movie.Director),
    getPlot(movie.Plot),
    await getTrailer(movie.Title, movie.Year),
  ];

  return infoAmalgamate(movieDetails);
};
