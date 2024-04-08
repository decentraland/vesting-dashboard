import { fetchContract } from '../contract/actions'
import { fetchTicker } from '../ticker/actions'
import { isValidAddress } from '../../utils'

export const CONNECT_REQUEST = '[Request] Connect'
export const CONNECT_SUCCESS = '[Success] Connect'
export const CONNECT_FAILURE = '[Failure] Connect'

export function connectRequest() {
  return {
    type: CONNECT_REQUEST,
  }
}

export function connectSuccess(address, network, chainId) {
  return {
    type: CONNECT_SUCCESS,
    address,
    network,
    chainId,
  }
}

export function connectFailure(error) {
  return {
    type: CONNECT_FAILURE,
    error,
  }
}

export function connect(contractAddress) {
  return async (dispatch) => {
    if (!contractAddress || !isValidAddress(contractAddress)) {
      return
    }
    dispatch(connectRequest())
    try {
      // dispatch(connectSuccess(address, network, chainId))
      // dispatch(fetchTicker())
      return contractAddress
    } catch (e) {
      dispatch(connectFailure(e.message))
    }
  }
}
