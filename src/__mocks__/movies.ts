import filmWithInfo from "../__tests__/testData/taken.json";
import * as movieFetcher from "../fetcher/movie/movieFetcher";
import * as messageHandler from "../messageHandler/messageHandler";
import { getMessage, MessageType } from "./messages";
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

export const getMessageHandlerResponse = async (
  messageType: MessageType,
  state: State
) => {
  await messageHandler.generateResponse(
    getMessage(messageType),
    mockApi,
    state
  );
};

export const mockMovieWithYear = () => {
  jest
    .spyOn(movieFetcher, "getMovieWithYear")
    .mockResolvedValueOnce(filmWithInfo);
};
