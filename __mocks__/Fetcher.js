// __mocks__/Fetcher.js

// Import this named export into your test file:
export const call = jest.fn(() => ({ title: "ahhhhh" }));

const mock = jest.fn().mockImplementation(() => {
  return { playSoundFile: mockPlaySoundFile };
});

export default mock;
