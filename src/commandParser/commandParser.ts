type Command = { command: string; restOfString: string };

export const commandParser = (sentence: string): Command => {
  try {
    let firstWord = "";
    if (sentence) {
      firstWord = sentence.split(" ")[0];
    }
    const restOfString = sentence.substr(firstWord.length + 1);
    const command = firstWord[0] === "/" ? firstWord.substr(1) : "";

    return { command, restOfString };
  } catch {
    return { command: "", restOfString: "" };
  }
};
