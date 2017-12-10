import { createSelector } from "reselect";

export const getFirstName = state => state.app.user.first;
export const getLastName = state => state.app.user.last;

export const getName = createSelector(getFirstName, getLastName, (first, last) => {
  return first + " " + last;
});
