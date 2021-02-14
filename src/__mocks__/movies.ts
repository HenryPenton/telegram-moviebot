beforeEach(() => {
  mockSendMessage.mockReset();
});

export const mockSendPoll = jest.fn(() => {});
export const mockSendMessage = jest.fn(() => {});
export const mockApi = {
  sendMessage: mockSendMessage,
  sendPoll: mockSendPoll,
};
