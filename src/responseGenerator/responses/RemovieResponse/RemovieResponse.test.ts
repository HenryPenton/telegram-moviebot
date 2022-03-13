import { State } from "../../../State/State";
import { RemovieResponse } from "./RemovieResponse";

describe("RemovieResponse", () => {
  test("responds that it cannot remove a movie that is not in the selection", () => {
    const state = new State();
    expect(
      new RemovieResponse(state, "barry goes to hollywood").generateResponse()
    ).toEqual(`Couldn't find that film in the selection`);
  });
});
