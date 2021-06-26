import { generateResponse } from "./messageHandler/messageHandler";
import { IncomingMessage } from "./types";
import { State } from "./State/State";
// eslint-disable-next-line
const TG = require("telegram-bot-api");

const getApi = () => {
  const api = new TG({
    token: process.env.TELEGRAM_BOT_TOKEN,
  });

  const mp = new TG.GetUpdateMessageProvider();

  api.setMessageProvider(mp);

  api
    .start()
    .then(() => {
      console.log("API is started");
    })
    .catch((err: string) => console.error(err));

  return api;
};

export const init = (): void => {
  const state = new State();
  const api = getApi();

  api.on("update", async (update: IncomingMessage) => {
    generateResponse(update, api, state);
  });
};
