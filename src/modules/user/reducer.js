import { SET_FIRST_NAME, SET_LAST_NAME } from "./actions";

export const initialState = {
  first: "Juan",
  last: "Cazala"
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_FIRST_NAME: {
      return {
        ...state,
        first: action.first
      };
    }

    case SET_LAST_NAME: {
      return {
        ...state,
        last: action.last
      };
    }

    default:
      return state;
  }
}
