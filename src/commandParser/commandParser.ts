type Command = { command: string; restOfString: string };

export const commandParser = (incomingText: string): Command => {
  let split = incomingText.split(" ");

  const command = getCommand(split);
  const restOfString = getRestOfString(split);

  return { command, restOfString };
};

const getCommand = (splitString: string[]) => {
  const firstWord = splitString[0];
  return firstWord[0] === "/" ? firstWord.substr(1) : "";
};

const getRestOfString = (splitString: string[]) => {
  let restOfString = "";
  splitString.shift();
  return splitString.length !== 0 ? (restOfString = splitString.join(" ")) : "";
};
