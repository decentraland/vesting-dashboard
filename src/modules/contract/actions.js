export const RELEASE_REQUEST = "[Request] Release";
export const RELEASE_SUCCESS = "[Success] Release";
export const RELEASE_FAILURE = "[Failure] Release";

export function releaseRequest(amount) {
  return {
    type: RELEASE_REQUEST,
    amount
  };
}

export function releaseSuccess(amount) {
  return {
    type: RELEASE_SUCCESS,
    amount
  };
}

export function releaseFailure(amount, error) {
  return {
    type: RELEASE_FAILURE,
    amount,
    error
  };
}

export function release(amount) {
  return async (dispatch, getState, api) => {
    dispatch(releaseRequest(amount));
    try {
      await api.release(amount);
      dispatch(releaseSuccess(amount));
      return amount;
    } catch (e) {
      dispatch(releaseFailure(amount, e.message));
    }
  };
}
