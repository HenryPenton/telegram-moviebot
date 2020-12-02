import { fetcher } from "../fetcher";

export const getTrailer = (movieName: string, movieYear?: string) => {
  if (movieYear) {
    return fetcher(
      `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&part=snippet&q=${movieName}%20${movieYear}%20movie%20trailer`
    )
      .then(
        (res) => `https://www.youtube.co.uk/watch?v=${res.items[0].id.videoId}`
      )
      .catch(() => "");
  } else {
    return fetcher(
      `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&part=snippet&q=${movieName}%20movie%20trailer`
    )
      .then(
        (res) => `https://www.youtube.co.uk/watch?v=${res.items[0].id.videoId}`
      )
      .catch(() => "");
  }
};
