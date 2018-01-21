import { FETCH_CONTRACT_REQUEST, FETCH_CONTRACT_SUCCESS, FETCH_CONTRACT_FAILURE } from "./actions";

export const INITIAL_STATE = {
  data: null,
  loading: false,
  error: null
};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_CONTRACT_REQUEST: {
      return {
        ...state,
        error: null,
        loading: true
      };
    }
    case FETCH_CONTRACT_SUCCESS: {
      return {
        ...state,
        error: null,
        loading: false,
        data: action.contract
      };
    }
    case FETCH_CONTRACT_FAILURE: {
      return {
        ...state,
        loading: false,
        error: action.error
      };
    }
    default:
      return state;
  }
}
