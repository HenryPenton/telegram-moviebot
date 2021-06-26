import { ResponseType } from "../../messageHandler/messageHandler";


export abstract class Response {
  abstract generateResponse: () => void;
  abstract getType: () => ResponseType;
}
