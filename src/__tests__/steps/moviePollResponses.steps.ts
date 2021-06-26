import {
  mockMovieWithInfo,
  mockSendMessage,
  mockSendPoll,
  runMessageHandler,
} from "../../__mocks__/movies";
import { State } from "../../State/State";
import { defineFeature, loadFeature } from "jest-cucumber";
import { MessageType } from "../../__mocks__/messages";
import { MoviePollResponse, Poll, RecursivePartial } from "../../types";

const feature = loadFeature(
  "./src/__tests__/features/moviePollResponses.feature"
);
const mockPollResponse: MoviePollResponse = {
  chat: { username: "some-user-name" },
  poll: {
    id: "12345",
    options: [{ text: "option one" }, { text: "option two" }],
    total_voter_count: 0,
  },
};
defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("A poll gets added to state", ({ given, when, then }) => {
    let state: State;
    given(
      "I have selected a number movies greater than the minimum",
      async () => {
        state = new State();
        mockMovieWithInfo();
        await runMessageHandler(MessageType.SET_MOVIE, state);
        mockMovieWithInfo();
        await runMessageHandler(MessageType.SET_MOVIE, state);
      }
    );

    when("I send the moviepoll command", async () => {
      await runMessageHandler(
        MessageType.MOVIEPOLL_WITH_RESPONSE,
        state,
        mockPollResponse
      );
    });

    then("The poll gets added to state", () => {
      const expectedPolls: Poll[] = [
        {
          id: "12345",
          movieVotes: [
            { movie: "option one", votes: [] },
            { movie: "option two", votes: [] },
          ],
        },
      ];
      expect(state.polls).toEqual(expectedPolls);
    });
  });

  test("A poll that has no response falls over gracefully", ({
    given,
    when,
    but,
    then,
  }) => {
    let state: State;

    given(
      "I have selected a number movies greater than the minimum",
      async () => {
        state = new State();
        mockMovieWithInfo();
        await runMessageHandler(MessageType.SET_MOVIE, state);
        mockMovieWithInfo();
        await runMessageHandler(MessageType.SET_MOVIE, state);
        mockSendMessage.mockReset(); //dont care about the mock calls from adding movies to state
      }
    );

    when("I send the moviepoll command", async () => {
      await runMessageHandler(
        MessageType.MOVIEPOLL_WITH_RESPONSE,
        state,
        mockPollResponse,
        true
      );
    });

    but("the response does not exist", () => {
      //configured above
    });

    then("The command falls over gracefully", () => {
      expect(state.polls).toEqual([]);
      expect(mockSendMessage).not.toHaveBeenCalled();
      expect(mockSendPoll).not.toHaveBeenCalled();
    });
  });
  test("A poll gets added to state and wipes previous state", ({
    given,
    when,
    then,
    and,
  }) => {
    let state: State;

    given(
      "I have selected a number movies greater than the minimum",
      async () => {
        state = new State();
        mockMovieWithInfo();
        await runMessageHandler(MessageType.SET_MOVIE, state);
        mockMovieWithInfo();
        await runMessageHandler(MessageType.SET_MOVIE, state);
      }
    );
    and("I have previously sent a moviepoll command", async () => {
      await runMessageHandler(
        MessageType.MOVIEPOLL_WITH_RESPONSE,
        state,
        mockPollResponse
      );
    });

    when("I send the moviepoll command", async () => {
      await runMessageHandler(
        MessageType.MOVIEPOLL_WITH_RESPONSE,
        state,
        mockPollResponse
      );
    });

    then("The poll gets added to state", () => {
      const expectedPolls: Poll[] = [
        {
          id: "12345",
          movieVotes: [
            { movie: "option one", votes: [] },
            { movie: "option two", votes: [] },
          ],
        },
      ];
      expect(state.polls).toEqual(expectedPolls);
    });

    and("It is the only thing in state", () => {
      //verified by strict equals
    });
  });

  test("A poll with a response that only has a poll id is not added to state", ({
    given,
    when,
    but,
    then,
  }) => {
    let state: State;
    given(
      "I have selected a number movies greater than the minimum",
      async () => {
        state = new State();
        mockMovieWithInfo();
        await runMessageHandler(MessageType.SET_MOVIE, state);
        mockMovieWithInfo();
        await runMessageHandler(MessageType.SET_MOVIE, state);
      }
    );

    when("I send the moviepoll command", async () => {
      const mockPollResponseWithOnlyId: RecursivePartial<MoviePollResponse> = {
        chat: { username: "some-user-name" },
        poll: {
          id: "12345",
          total_voter_count: 0,
        },
      };
      await runMessageHandler(
        MessageType.MOVIEPOLL_WITH_RESPONSE,
        state,
        mockPollResponseWithOnlyId as MoviePollResponse
      );
    });

    but("the response is only contains a poll id", () => {
      //defined above
    });

    then("poll is not added to state", () => {
      expect(state.polls).toEqual([]);
    });
  });

  test("A poll with a response that only has poll options is not added to state", ({
    given,
    when,
    but,
    then,
  }) => {
    let state: State;
    given(
      "I have selected a number movies greater than the minimum",
      async () => {
        state = new State();
        mockMovieWithInfo();
        await runMessageHandler(MessageType.SET_MOVIE, state);
        mockMovieWithInfo();
        await runMessageHandler(MessageType.SET_MOVIE, state);
      }
    );

    when("I send the moviepoll command", async () => {
      const mockPollResponseWithOnlyOptions: RecursivePartial<MoviePollResponse> =
        {
          chat: { username: "some-user-name" },
          poll: {
            options: [{ text: "1" }, { text: "2" }],
            total_voter_count: 0,
          },
        };
      await runMessageHandler(
        MessageType.MOVIEPOLL_WITH_RESPONSE,
        state,
        mockPollResponseWithOnlyOptions as MoviePollResponse
      );
    });
    but("the response is only contains poll options", () => {
      //defined above
    });

    then("poll is not added to state", () => {
      expect(state.polls).toEqual([]);
    });
  });

  test("A vote on a poll gets counted", ({ given, when, and, then }) => {
    let state: State;
    given(
      "I have selected a number movies greater than the minimum",
      async () => {
        state = new State();
        mockMovieWithInfo();
        await runMessageHandler(MessageType.SET_MOVIE, state);
        mockMovieWithInfo();
        await runMessageHandler(MessageType.SET_MOVIE, state);
      }
    );
    and("I have generated a moviepoll to vote on", async () => {
      await runMessageHandler(
        MessageType.MOVIEPOLL_WITH_RESPONSE,
        state,
        mockPollResponse
      );
    });

    when("I send a vote on a movie poll", async () => {
      await runMessageHandler(MessageType.MOVIEPOLL_VOTE, state);
    });

    then("The poll gets updated in state", () => {
      const expectedPolls: Poll[] = [
        {
          id: "12345",
          movieVotes: [
            { movie: "option one", votes: ["12345"] },
            { movie: "option two", votes: [] },
          ],
        },
      ];

      expect(state.polls).toEqual(expectedPolls);
    });
  });

  test("A vote on a poll doesnt get counted if no poll options selected", ({
    given,
    and,
    when,
    but,
    then,
  }) => {
    let state: State;
    given(
      "I have selected a number movies greater than the minimum",
      async () => {
        state = new State();
        mockMovieWithInfo();
        await runMessageHandler(MessageType.SET_MOVIE, state);
        mockMovieWithInfo();
        await runMessageHandler(MessageType.SET_MOVIE, state);
      }
    );
    and("I have generated a moviepoll to vote on", async () => {
      await runMessageHandler(
        MessageType.MOVIEPOLL_WITH_RESPONSE,
        state,
        mockPollResponse
      );
    });

    when("I send a vote on a movie poll", async () => {
      await runMessageHandler(MessageType.MOVIEPOLL_VOTE_NO_OPTIONS, state);
    });

    but("there are no poll options", () => {
      //dealt with above
    });

    then("The poll vote doesnt get counted", () => {
      const expectedPolls: Poll[] = [
        {
          id: "12345",
          movieVotes: [
            { movie: "option one", votes: [] },
            { movie: "option two", votes: [] },
          ],
        },
      ];
      expect(state.polls).toEqual(expectedPolls);
    });
  });

  test("A vote on a poll doesnt get counted if no poll id", ({
    given,
    and,
    when,
    but,
    then,
  }) => {
    let state: State;
    given(
      "I have selected a number movies greater than the minimum",
      async () => {
        state = new State();
        mockMovieWithInfo();
        await runMessageHandler(MessageType.SET_MOVIE, state);
        mockMovieWithInfo();
        await runMessageHandler(MessageType.SET_MOVIE, state);
      }
    );
    and("I have generated a moviepoll to vote on", async () => {
      await runMessageHandler(
        MessageType.MOVIEPOLL_WITH_RESPONSE,
        state,
        mockPollResponse
      );
    });

    when("I send a vote on a movie poll", async () => {
      await runMessageHandler(MessageType.MOVIEPOLL_VOTE_NO_ID, state);
    });

    but("there is no poll id", () => {
      //dealt with above
    });
    then("The poll vote doesnt get counted", () => {
      const expectedPolls: Poll[] = [
        {
          id: "12345",
          movieVotes: [
            { movie: "option one", votes: [] },
            { movie: "option two", votes: [] },
          ],
        },
      ];
      expect(state.polls).toEqual(expectedPolls);
    });
  });

  test("A vote on a poll doesnt get counted if the poll id doesnt match one in state", ({
    given,
    and,
    when,
    then,
  }) => {
    let state: State;
    given(
      "I have selected a number movies greater than the minimum",
      async () => {
        state = new State();
        mockMovieWithInfo();
        await runMessageHandler(MessageType.SET_MOVIE, state);
        mockMovieWithInfo();
        await runMessageHandler(MessageType.SET_MOVIE, state);
      }
    );

    and("I have generated a moviepoll to vote on", async () => {
      await runMessageHandler(
        MessageType.MOVIEPOLL_WITH_RESPONSE,
        state,
        mockPollResponse
      );
    });

    when("I send a vote on a movie poll", async () => {
      await runMessageHandler(MessageType.MOVIEPOLL_VOTE_ID_MISMATCH, state);
    });

    then("The poll vote doesnt get counted", () => {
      const expectedPolls: Poll[] = [
        {
          id: "12345",
          movieVotes: [
            { movie: "option one", votes: [] },
            { movie: "option two", votes: [] },
          ],
        },
      ];
      expect(state.polls).toEqual(expectedPolls);
    });
  });
});
