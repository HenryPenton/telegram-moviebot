export const removeFromArray = <T>(array: T[], itemToRemove: T):void => {
  const index = array.indexOf(itemToRemove);

  if (index > -1) {
    array.splice(index, 1);
  }
};
