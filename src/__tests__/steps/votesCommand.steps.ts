import { defineFeature, loadFeature } from "jest-cucumber";
import { State } from "../../State/State";
import { MoviePollResponse } from "../../types";
import { MessageType } from "../../__mocks__/messages";
import { mockSendMessage, runMessageHandler } from "../../__mocks__/movies";

const feature = loadFeature("./src/__tests__/features/votesCommand.feature");

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test("The votes command returns movie votes when there are multiple polls", ({
    given,
    when,
    then,
  }) => {
    let state: State;

    given("There is are two polls", () => {
      state = new State();
      state.polls = [
        { movieVotes: [{ movie: "movie", votes: 1 }], id: "some id" },
        { movieVotes: [{ movie: "movie", votes: 2 }], id: "some other id" },
      ];
    });

    when("I execute the votes command", async () => {
      await runMessageHandler(MessageType.VOTES, state);
    });

    then("I see all of the votes", () => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: `movie has 2 votes \nmovie has 1 votes \n`,
      });
    });
  });

  test("The votes command returns movie votes when there is one poll", ({
    given,
    when,
    then,
  }) => {
    let state: State;
    given("There is a poll", () => {
      state = new State();
      state.polls = [
        {
          movieVotes: [
            { movie: "movie", votes: 5 },
            { movie: "moviewithoutvotes", votes: 0 },
          ],
          id: "some id",
        },
      ];
    });

    when("I execute the votes command", async () => {
      await runMessageHandler(MessageType.VOTES, state);
    });

    then("I see all of the votes", () => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: `movie has 5 votes \n`,
      });
    });
  });

  test("The votes command returns movie votes in order of number of votes", ({
    given,
    when,
    then,
  }) => {
    let state: State;
    given("There is a poll", () => {
      state = new State();
      state.polls = [
        {
          movieVotes: [
            { movie: "moviefivevotes", votes: 5 },
            { movie: "moviewithoutvotes", votes: 0 },
            { movie: "movietwovotes", votes: 2 },
            { movie: "moviesevenvotes", votes: 7 },
          ],
          id: "some id",
        },
      ];
    });

    when("I execute the votes command", async () => {
      await runMessageHandler(MessageType.VOTES, state);
    });

    then("I see the votes in order", () => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: `moviesevenvotes has 7 votes \nmoviefivevotes has 5 votes \nmovietwovotes has 2 votes \n`,
      });
    });
  });
});
