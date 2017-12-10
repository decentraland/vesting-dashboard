export const SET_FIRST_NAME = "Set First Name";
export const SET_LAST_NAME = "Set Last Name";

export function setFirstName(first) {
  return {
    type: SET_FIRST_NAME,
    first
  };
}

export function setLastName(last) {
  return {
    type: SET_LAST_NAME,
    last
  };
}

export function setNameAsync(first, last) {
  return (dispatch, getState, { api }) => {
    // async stuff
    setTimeout(() => {
      dispatch(setFirstName(first));
      dispatch(setLastName(last));
    }, 1000);
  };
}
