import fetch from "node-fetch";

const fetcher = async (url: string) => {
  return fetch(url)
    .then((result) => result.json())
    .then((json) => json)
    .catch((e) => ({ Response: "False", err: e }));
};

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
export const getMovie = async (queryString: string) =>
  fetcher(
    `http://www.omdbapi.com/?t=${queryString}&apikey=${process.env.MOVIE_DATABASE_KEY}`
  );
