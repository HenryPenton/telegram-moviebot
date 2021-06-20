import { defineFeature, loadFeature } from "jest-cucumber";
import { State } from "../../State/State";
import { MoviePollResponse, Poll } from "../../types";
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
        { movieVotes: [{ movie: "movie", votes: ["1"] }], id: "some id" },
        {
          movieVotes: [{ movie: "other", votes: ["1", "2"] }],
          id: "some other id",
        },
      ];
    });

    when("I execute the votes command", async () => {
      await runMessageHandler(MessageType.VOTES, state);
    });

    then("I see all of the votes", () => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: `other has 2 votes (2 and 1) \nmovie has 1 vote (1) \n`,
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
            { movie: "movie", votes: ["1", "2", "3", "4", "5"] },
            { movie: "moviewithoutvotes", votes: [] },
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
        text: `movie has 5 votes (5, 4, 3, 2 and 1) \n`,
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
            { movie: "moviefivevotes", votes: ["1", "2", "3", "4", "5"] },
            { movie: "moviewithoutvotes", votes: [] },
            { movie: "movietwovotes", votes: ["1", "2"] },
            {
              movie: "moviesevenvotes",
              votes: ["1", "2", "3", "4", "5", "6", "7"],
            },
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
        text: `moviesevenvotes has 7 votes (7, 6, 5, 4, 3, 2 and 1) \nmoviefivevotes has 5 votes (5, 4, 3, 2 and 1) \nmovietwovotes has 2 votes (2 and 1) \n`,
      });
    });
  });

  test("Retracting votes removes votes from the counter", ({
    given,
    and,
    when,
    then,
  }) => {
    let state: State;
    given("There is a poll", () => {
      state = new State();
      state.polls = [
        {
          movieVotes: [
            {
              movie: "moviefivevotes",
              votes: ["1", "HenryPenton", "3", "4", "5"],
            },
            { movie: "moviewithoutvotes", votes: [] },
            { movie: "movietwovotes", votes: ["HenryPenton", "2"] },
            {
              movie: "moviesevenvotes",
              votes: ["1", "2", "3", "HenryPenton", "5", "6", "7"],
            },
          ],
          id: "12345",
        },
      ];
    });

    and("I have voted for at least one movie on the poll", () => {
      //dealt with above
    });

    when("I retract my votes", async () => {
      await runMessageHandler(MessageType.RETRACT_VOTES, state);
    });

    then("The state is updated accordingly", () => {
      const expectedPolls: Poll[] = [
        {
          id: "12345",
          movieVotes: [
            {
              movie: "moviefivevotes",
              votes: ["1", "3", "4", "5"],
            },
            { movie: "moviewithoutvotes", votes: [] },
            { movie: "movietwovotes", votes: ["2"] },
            {
              movie: "moviesevenvotes",
              votes: ["1", "2", "3", "5", "6", "7"],
            },
          ],
        },
      ];
      expect(state.polls).toEqual(expectedPolls);
    });
  });

  test("The votes command returns nothing when there are no votes", ({
    given,
    and,
    when,
    then,
  }) => {
    let state: State;
    given("There is a poll", () => {
      state = new State();
      state.polls = [
        {
          movieVotes: [
            {
              movie: "some movie",
              votes: [],
            },
            {
              movie: "some other movie",
              votes: [],
            },
          ],
          id: "12345",
        },
      ];
    });
    and("I have retracted my votes", async () => {
      await runMessageHandler(MessageType.RETRACT_VOTES, state);
    });

    when("I execute the votes command", async () => {
      await runMessageHandler(MessageType.VOTES, state);
    });

    then("I see a response telling me there are no votes", () => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: "some_chat_id",
        text: "Could not find any votes",
      });
    });
  });

  test("Voters listed correctly", ({ given, when, and, then }) => {
    let state: State;
    let numberOfVoters = 0;

    given("There is a poll", () => {
      state = new State();
      state.polls = [
        { movieVotes: [{ movie: "movie", votes: [] }], id: "some id" },
      ];
    });

    and(/^there are (.*) voters$/, (voters: number) => {
      const voterNames = ["HenryPenton", "JD", "JL"];
      numberOfVoters = voters;
      let counter = voters;
      while (counter > 0) {
        state.polls[0].movieVotes[0].votes.push(voterNames[counter - 1]);

        counter--;
      }
    });

    when("I execute the votes command", async () => {
      await runMessageHandler(MessageType.VOTES, state);
    });

    then(
      /^I see all of the votes with grammatically correct (.*)$/,
      (voters: string) => {
        const plural = numberOfVoters == 1 ? "vote" : "votes";

        expect(mockSendMessage).toHaveBeenCalledWith({
          chat_id: "some_chat_id",
          text: `movie has ${numberOfVoters} ${plural} (${voters}) \n`,
        });
      }
    );
  });
});
