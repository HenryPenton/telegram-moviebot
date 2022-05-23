import { MoviePollId } from "../State/State";

export type Option = { text: string };

export type IncomingMessage = {
  message?: {
    from: { first_name: string };
    chat: { id?: string | number };
    text: string;
  };

  poll_answer?: {
    poll_id: MoviePollId;
    user: {
      username: string;
      id: number;
    };
    option_ids: OptionsSelected;
  };
};

export type ChatId = string | number;

export enum ResponseType {
  message = "message",
  moviePoll = "moviePoll",
  none = "none",
}

export type OptionsSelected = number[];

export type MoviePollResponse = {
  chat: {
    username: string;
  };
  poll: {
    id: MoviePollId;
    options: Option[];
    total_voter_count: 0;
  };
};
