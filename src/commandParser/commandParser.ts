type Command = { command: string; restOfString: string };

export const commandParser = (incomingText: string): Command => {
  const split = incomingText.split(" ");

  const command = getCommand(split);
  const restOfString = getRestOfString(split);

  return { command, restOfString };
};

const getCommand = (splitString: string[]) => {
  const firstWord = splitString[0];
  return firstWord[0] === "/" ? firstWord.substr(1) : "";
};

const getRestOfString = (splitString: string[]) => {
  splitString.shift();
  return splitString.length !== 0 ? splitString.join(" ") : "";
};
