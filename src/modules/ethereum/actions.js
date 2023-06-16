import { fetchContract } from '../contract/actions'
import { fetchTicker } from '../ticker/actions'
import { getAddress as getContractAddress } from '../contract/selectors'
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

export function connect() {
  return async (dispatch, getState, api) => {
    const contractAddress = getContractAddress(getState())
    if (!contractAddress || !isValidAddress(contractAddress)) {
      return
    }
    dispatch(connectRequest())
    try {
      const { address, network, chainId } = await api.connect()
      dispatch(connectSuccess(address, network, chainId))
      dispatch(fetchContract())
      dispatch(fetchTicker())
      return address
    } catch (e) {
      dispatch(connectFailure(e.message))
    }
  }
}
