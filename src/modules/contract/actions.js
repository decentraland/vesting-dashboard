export const FETCH_CONTRACT_REQUEST = '[Request] Fetch Contract'
export const FETCH_CONTRACT_SUCCESS = '[Success] Fetch Contract'
export const FETCH_CONTRACT_FAILURE = '[Failure] Fetch Contract'

export const RELEASE_REQUEST = '[Request] Release'
export const RELEASE_SUCCESS = '[Success] Release'
export const RELEASE_FAILURE = '[Failure] Release'

export const CHANGE_BENEFICIARY_REQUEST = '[Request] Change Beneficiary'
export const CHANGE_BENEFICIARY_SUCCESS = '[Success] Change Beneficiary'
export const CHANGE_BENEFICIARY_FAILURE = '[Failure] Change Beneficiary'

export function fetchContractRequest() {
  return {
    type: FETCH_CONTRACT_REQUEST,
  }
}

export function fetchContractSuccess(contract) {
  return {
    type: FETCH_CONTRACT_SUCCESS,
    contract,
  }
}

export function fetchContractFailure(error) {
  return {
    type: FETCH_CONTRACT_FAILURE,
    error,
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

export function releaseRequest() {
  return {
    type: RELEASE_REQUEST,
  }
}

export function releaseSuccess() {
  return {
    type: RELEASE_SUCCESS,
  }
}

export function releaseFailure(error) {
  return {
    type: RELEASE_FAILURE,
    error,
  }
}

export function release() {
  return async (dispatch, getState, api) => {
    dispatch(releaseRequest())
    try {
      await api.release()
      dispatch(releaseSuccess())
      return
    } catch (e) {
      dispatch(releaseFailure(e.message))
    }
  }
}

export function changeBeneficiaryRequest(address) {
  return {
    type: CHANGE_BENEFICIARY_REQUEST,
    address,
  }
}

export function changeBeneficiarySuccess(address) {
  return {
    type: CHANGE_BENEFICIARY_SUCCESS,
    address,
  }
}

export function changeBeneficiaryFailure(address, error) {
  return {
    type: CHANGE_BENEFICIARY_FAILURE,
    address,
    error,
  }
}

export function changeBeneficiary(address) {
  return async (dispatch, getState, api) => {
    dispatch(changeBeneficiaryRequest(address))

    return new Promise((resolve, reject) => {
      api
        .changeBeneficiary(address)
        .then(() => {
          dispatch(changeBeneficiarySuccess(address))
          resolve(address)
        })
        .catch((e) => {
          dispatch(changeBeneficiaryFailure(address, e.message))
          reject(e)
        })
    })
  }
}
