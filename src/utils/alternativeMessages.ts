import { Commands } from "../responseGenerator/responseGenerator";

export const checkMessageForAlternatives = (
  command: string,
  message: string
): string => {
  const isImdbId = checkMessageForImdbId(message);

  if (isImdbId) {
    if (command === Commands.movie) {
      return Commands.movieid;
    } else if (command === Commands.setmovie) {
      return Commands.setmovieid;
    }
  }

  return command;
};
const checkMessageForImdbId = (message: string) =>
  message.length >= 2 && message[0] === "t" && message[1] === "t";
