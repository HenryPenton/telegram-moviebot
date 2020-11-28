import { MovieResponse } from "../MovieResponse/MovieResponse";

export class ResponseGenerator {
  command: string;
  restOfString: string;

  constructor(command: string, restOfString: string) {
    this.command = command;
    this.restOfString = restOfString;
  }

  getResponse() {
    switch (this.command) {
      case "movie":
        return new MovieResponse(this.restOfString).generateResponse();
    }
    
  }
}
