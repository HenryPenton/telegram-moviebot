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


export type MovieVote = { movie: string; votes: string[] };

export type MoviePollId = string;

export interface Poll {
  id: MoviePollId;
  movieVotes: MovieVote[];
}

type Option = { text: string };

export interface MoviePollResponse {
  chat: {
    username: string;
  };
  poll: {
    id: MoviePollId;
    options: Option[];
    total_voter_count: 0;
  };
}



export type Trailer = {
  link: string;
};

export type YoutubeResponse = {
  items: { id: { videoId: string } }[];
};
