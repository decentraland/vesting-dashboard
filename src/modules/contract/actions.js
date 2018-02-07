export const FETCH_CONTRACT_REQUEST = '[Request] Fetch Contract'
export const FETCH_CONTRACT_SUCCESS = '[Success] Fetch Contract'
export const FETCH_CONTRACT_FAILURE = '[Failure] Fetch Contract'

export const RELEASE_REQUEST = '[Request] Release'
export const RELEASE_SUCCESS = '[Success] Release'
export const RELEASE_FAILURE = '[Failure] Release'

export function fetchContractRequest() {
  return {
    type: FETCH_CONTRACT_REQUEST
  }
}

export function fetchContractSuccess(contract) {
  return {
    type: FETCH_CONTRACT_SUCCESS,
    contract
  }
}

export function fetchContractFailure(error) {
  return {
    type: FETCH_CONTRACT_FAILURE,
    error
  }
}

export function fetchContract() {
  return async (dispatch, getState, api) => {
    dispatch(fetchContractRequest())
    try {
      const contract = await api.fetchContract()
      dispatch(fetchContractSuccess(contract))
      return contract
    } catch (e) {
      dispatch(fetchContractFailure(e.message))
    }
  }
}

export function releaseRequest(amount) {
  return {
    type: RELEASE_REQUEST,
    amount
  }
}

export function releaseSuccess(amount) {
  return {
    type: RELEASE_SUCCESS,
    amount
  }
}

export function releaseFailure(amount, error) {
  return {
    type: RELEASE_FAILURE,
    amount,
    error
  }
}

export function release(amount) {
  return async (dispatch, getState, api) => {
    dispatch(releaseRequest(amount))
    try {
      await api.release(amount)
      dispatch(releaseSuccess(amount))
      return amount
    } catch (e) {
      dispatch(releaseFailure(amount, e.message))
    }
  }
}
