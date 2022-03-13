import { SearchType } from "../../../commands";
import { MovieResponse } from "./MovieResponse";

describe("movie response", () => {
  test("blob", () => {
    new MovieResponse("", SearchType.WITH_ID);
  });
});
