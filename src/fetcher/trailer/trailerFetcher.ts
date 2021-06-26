import { fetcher } from "../fetcher";

type Trailer = string;

export const getTrailer = (movieName: string): Promise<Trailer> => {
  return fetcher(
    `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&part=snippet&q=${movieName}%20movie%20trailer`
  )
    .then(
      (res) => `https://www.youtube.co.uk/watch?v=${res.items[0].id.videoId}`
    )
    .catch(() => "");
};
