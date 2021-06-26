import { defineFeature, loadFeature } from "jest-cucumber";
import { Poll, State } from "../../State/State";
import { MessageType } from "../../__mocks__/messages";
import { mockSendMessage, runMessageHandler } from "../../__mocks__/movies";

const feature = loadFeature("./src/__tests__/features/helpCommand.feature");

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const state = new State();

  test("Help returns the list of commands", ({ when, then }) => {
    when("I execute the help command", async () => {
      await runMessageHandler(MessageType.HELP, state);
    });

    then("I see all of the commands", () => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: `
movie: Get information about a movie by  name
movieyear: Get information about a movie by  its year, where the format is /movieyear moviename YYYY
movieid: Get information about a movie by  imdb id
setmovie: Sets a movie in the selection by name
setmovieyear: Sets a movie in the selection by its year, where the format is /movieyear moviename YYYY
setmovieid: Sets a movie in the selection by imdb id
getmovies: Get the movie selection
moviepoll: Get a movie poll in the form of a telegram vote!
removie: Remove a movie by the id given in /getmovies or by name - if a partial name is given, the first match will be removed
reset: Resets the movie selection
cleanup: Removes any duplicate movies from the selection
votes: Get the voting status on the current movie poll
help: Get this list`,
      });
    });
  });
});
