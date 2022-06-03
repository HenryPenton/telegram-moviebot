import { removeFromArray } from "./removeFromArray";
// export const removeFromArray = <T>(array: T[], itemToRemove: T): void => {
//   const index = array.indexOf(itemToRemove);

//   if (index > -1) {
//     array.splice(index, 1);
//   }
// };

describe("remove from array", () => {
  test("it removes an element from an array of one", () => {
    const arrayPreRemoval = ["a"];
    const arrayPostRemoval = removeFromArray<string>(arrayPreRemoval, "a");

    expect(arrayPostRemoval).toEqual([]);
  });

  test("it removes an element from an array of two", () => {
    const arrayPreRemoval = ["a", "b"];
    const arrayPostRemoval = removeFromArray<string>(arrayPreRemoval, "a");

    expect(arrayPostRemoval).toEqual(["b"]);
  });
});
