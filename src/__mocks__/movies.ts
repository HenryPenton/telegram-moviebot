import takenNotImdbFirst from "../__tests__/testData/takenNotImdbFirst.json";
import filmWithInfo from "../__tests__/testData/taken.json";
import * as fetcher from "../fetcher/fetcher";
import submarineUnrated from "../__tests__/testData/submarineUnrated.json";
import movieTrailer from "../__tests__/testData/ytResponse.json";
import { getMessage, MessageType } from "./messages";
import { State } from "../State/State";
import {
  generateResponse,
  IncomingMessage,
  MoviePollResponse,
  TelegramApi,
} from "../messageHandler/messageHandler";

beforeEach(() => {
  mockSendMessage.mockReset();
});

export const mockSendPoll = jest.fn();
export const mockSendMessage = jest.fn();

export const mockApi = {
  sendMessage: mockSendMessage,
  sendPoll: mockSendPoll,
};

export const mockApiWithPollResponse = (
  responseToResolve: MoviePollResponse,
  shouldFail?: boolean
): TelegramApi => ({
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
): Promise<void> => {
  await generateResponse(
    getMessage(messageType) as IncomingMessage,
    pollResponse ? mockApiWithPollResponse(pollResponse, shouldFail) : mockApi,
    state
  );
};

export const mockMovieWithInfo = (): void => {
  jest
    .spyOn(fetcher, "fetcher")
    .mockResolvedValueOnce(filmWithInfo as unknown as fetcher.UnknownObject);
};

export const mockMovieWithDifferentRatings = (): void => {
  jest
    .spyOn(fetcher, "fetcher")
    .mockResolvedValueOnce(
      takenNotImdbFirst as unknown as fetcher.UnknownObject
    );
};

export const mockMovieWithNoRatings = (): void => {
  jest
    .spyOn(fetcher, "fetcher")
    .mockResolvedValueOnce(
      submarineUnrated as unknown as fetcher.UnknownObject
    );
};

export const mockOmdbUnavailable = (): void => {
  jest.spyOn(fetcher, "fetcher").mockRejectedValueOnce("some error");
};
export const mockYoutubeUnavailable = (): void => {
  jest.spyOn(fetcher, "fetcher").mockRejectedValueOnce("some error");
};

export const mockNoTrailer = (): void => {
  jest.spyOn(fetcher, "fetcher").mockRejectedValueOnce("some error");
};

export const mockMovieWithTrailer = (): void => {
  jest
    .spyOn(fetcher, "fetcher")
    .mockResolvedValueOnce(movieTrailer as unknown as fetcher.UnknownObject);
};
