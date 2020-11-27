import commandParser from "../commandParser/commandParser";

describe("the command parser", () => {
  test("the command parser should return a object", () => {
    expect(commandParser("stringymcstringface")).toBeInstanceOf(Object);
  });

  test("the function returns the rest of the sentence separately", () => {
    expect(commandParser("hello I am a sentence")).toMatchObject({
      command: "",
      restOfString: "I am a sentence",
    });
  });

  test("the function only passes back a command if its prefixed with a slash, otherwise its a blank string", () => {
    expect(commandParser("/abcde")).toMatchObject({
      command: "abcde",
      restOfString: "",
    });
    expect(commandParser("abcde")).toMatchObject({
      command: "",
      restOfString: "",
    });
  });

  test("The function should remove the slash from the command", () => {
    expect(commandParser("/abcde")).toMatchObject({
      command: "abcde",
      restOfString: "",
    });
    expect(
      commandParser(
        "/abcde Id aute est anim et nulla elit sunt do sint amet id reprehenderit dolor laborum."
      )
    ).toMatchObject({
      command: "abcde",
      restOfString:
        "Id aute est anim et nulla elit sunt do sint amet id reprehenderit dolor laborum.",
    });
  });
});
