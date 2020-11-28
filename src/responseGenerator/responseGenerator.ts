import { commandParser } from "../commandParser/commandParser";
import { ResponseType } from "../messageHandler/messageHandler";

type Response = { response: string; type: ResponseType };

export const generate = (messageText: string): Response => {
  const { command, restOfString } = commandParser(messageText);
  
  if (command === "movie") {
  
  }

  const response =
    "Movie: Taken (2008)\n\nRuntime: 90 min\nInternet Movie Database: 7.8/10\nRotten Tomatoes: 58%\nMetacritic: 51/100\n\nDirector: Pierre Morel\n\nPlot: A retired CIA agent travels across Europe and relies on his old skills to save his estranged daughter, who has been kidnapped while on a trip to Paris.";

  const type = ResponseType.message;
  return { response, type };
};
