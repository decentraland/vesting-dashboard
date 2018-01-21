import { fetchContract } from "../contract/actions";

export const CONNECT_REQUEST = "[Request] Connect";
export const CONNECT_SUCCESS = "[Success] Connect";
export const CONNECT_FAILURE = "[Failure] Connect";

export function connectRequest() {
  return {
    type: CONNECT_REQUEST
  };
}

export function connectSuccess(address) {
  return {
    type: CONNECT_SUCCESS,
    address
  };
}

export function connectFailure(error) {
  return {
    type: CONNECT_FAILURE,
    error
  };
}

export function connect() {
  return async (dispatch, getState, api) => {
    dispatch(connectRequest());
    try {
      const address = await api.connect();
      dispatch(connectSuccess(address));
      dispatch(fetchContract());
      return address;
    } catch (e) {
      dispatch(connectFailure(e.message));
    }
  };
}
