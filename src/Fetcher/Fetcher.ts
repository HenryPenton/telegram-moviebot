import fetch from "node-fetch";

class Fetcher {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  async call(): Promise<unknown> {
    return fetch(this.url)
      .then((result) => result.json())
      .then((json) => json)
      .catch((e) => ({ status: "Failure", err: e }));
  }
}

export default Fetcher;
