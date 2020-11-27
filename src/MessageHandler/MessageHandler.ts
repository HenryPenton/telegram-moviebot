import { IncomingMessage } from "../types";

export class MessageHandler {
  message: IncomingMessage;
  api: any;
  constructor(message: IncomingMessage, api: any) {
    this.message = message;
    this.api = api;
  }

  sendMessage(message: string, chat_id: string) {}

  fire() {
    this.sendMessage("some message", "some id");
  }
}
