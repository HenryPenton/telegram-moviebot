import filmWithInfo from "../__tests__/testData/taken.json";
import * as fetcher from "../fetcher/fetcher";
import * as messageHandler from "../messageHandler/messageHandler";
import movieTrailer from "../__tests__/testData/ytResponse.json";
import { getMessage, MessageType } from "./messages";
import { State } from "../State/State";
import { MoviePollResponse } from "../types";

beforeEach(() => {
  mockSendMessage.mockReset();
});

export const mockSendPoll = jest.fn(() => {});
export const mockSendMessage = jest.fn(() => {});

export const mockApi = {
  sendMessage: mockSendMessage,
  sendPoll: mockSendPoll,
};

export const mockApiWithPollResponse = (
  responseToResolve: MoviePollResponse,
  shouldFail?: boolean
) => ({
  sendMessage: mockSendMessage,
  sendPoll: shouldFail
    ? jest.fn().mockImplementation(() => Promise.reject("somefailure"))
    : mockSendPoll.mockImplementation(() => Promise.resolve(responseToResolve)),
});

export const runMessageHandler = async (
  messageType: MessageType,
  state: State,
  pollResponse?: MoviePollResponse,
  shouldFail?: boolean
) => {
  await messageHandler.generateResponse(
    getMessage(messageType)!,
    pollResponse ? mockApiWithPollResponse(pollResponse, shouldFail) : mockApi,
    state
  );
};

export const mockMovieWithInfo = () => {
  jest.spyOn(fetcher, "fetcher").mockResolvedValueOnce(filmWithInfo);
};

export const mockOmdbUnavailable = () => {
  jest.spyOn(fetcher, "fetcher").mockRejectedValueOnce("some error");
};
export const mockYoutubeUnavailable = () => {
  jest.spyOn(fetcher, "fetcher").mockRejectedValueOnce("some error");
};

export const mockNoTrailer = () => {
  jest.spyOn(fetcher, "fetcher").mockRejectedValueOnce("some error");
};

export const mockMovieWithTrailer = () => {
  jest.spyOn(fetcher, "fetcher").mockResolvedValueOnce(movieTrailer);
};

export const stateWithXMovies = (x: number) => {};
