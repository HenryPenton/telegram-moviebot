export abstract class Response {
  abstract generateResponse: () => void;
  abstract getType: () => void;
}
