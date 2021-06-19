export type IncomingMessage = {
  message: {
    from: { first_name: string };
    chat: { id?: string | number };
    text: string;
  };
};

export interface Poll {
  id: string;
  movies: string[];
}

export interface MoviePollResponse {
  chat: {
    username: string;
  };
  poll: {
    id: string;
    options: string[];
    total_voter_count: 0;
  };
}
export type Rating = { Source: string; Value: string };

export type Movie = {
  Response?: string;
  Title?: string;
  Year?: string;
  Rated?: string;
  Released?: string;
  Runtime?: string;
  Genre?: string;
  Director?: string;
  Writer?: string;
  Actors?: string;
  Plot?: string;
  Language?: string;
  Country?: string;
  Awards?: string;
  Poster?: string;
  imdbID?: string;
  Ratings?: Rating[];
};

export type Trailer = {
  link: string;
};

export type Failure = {
  Response: string;
  err: any;
};

export type YoutubeResponse = {
  items: [{ id: { videoId: string } }];
};
