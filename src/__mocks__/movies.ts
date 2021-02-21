import filmWithInfo from "../__tests__/testData/taken.json";
import * as fetcher from "../fetcher/fetcher";
import * as messageHandler from "../messageHandler/messageHandler";
import movieTrailer from "../__tests__/testData/ytResponse.json";
import { getInvalidMessage, getMessage, MessageType } from "./messages";
import { State } from "../State/State";

beforeEach(() => {
  mockSendMessage.mockReset();
});

export const mockSendPoll = jest.fn(() => {});
export const mockSendMessage = jest.fn(() => {});
export const mockApi = {
  sendMessage: mockSendMessage,
  sendPoll: mockSendPoll,
};

export const runMessageHandler = async (
  messageType: MessageType,
  state: State
) => {
  await messageHandler.generateResponse(
    getMessage(messageType),
    mockApi,
    state
  );
};

export const runInvalidMessageHandler = async (
  invalidCommand: string,
  state: State
) => {
  await messageHandler.generateResponse(
    getInvalidMessage(invalidCommand),
    mockApi,
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
