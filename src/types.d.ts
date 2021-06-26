export type optionsSelected = number[];

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
    option_ids: optionsSelected;
  };
};

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

type Option = { text: string };

