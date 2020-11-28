import { Rating } from "../types";

export const getPlot = (plot?: string): string => (plot ? `Plot: ${plot}` : "");

export const getDirector = (director?: string): string =>
  director ? `Director: ${director}` : "";

export const getRuntime = (runtime?: string): string =>
  runtime ? `Runtime: ${runtime}` : "";

export const getTitleAndYear = (title?: string, year?: string): string => {
  if (!title) return "Unknown movie";
  const movieYear = year;
  const movieTitle = movieYear
    ? `Movie: ${title} (${year})`
    : `Movie: ${title}`;

  return movieTitle;
};

export const getRatings = (ratings?: Rating[]): string => {
  let allRatings = "";
  ratings?.forEach((rating, index) => {
    allRatings = `${allRatings}${index === 0 ? "" : "\n"}${rating.Source}: ${
      rating.Value
    }`;
  });
  return allRatings;
};
