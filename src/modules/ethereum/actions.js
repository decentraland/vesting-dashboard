import { fetchContract } from 'modules/contract/actions'
import { fetchTicker } from 'modules/ticker/actions'
import { getAddress } from 'modules/contract/selectors'
import { isValidAddress } from 'utils'

export const CONNECT_REQUEST = '[Request] Connect'
export const CONNECT_SUCCESS = '[Success] Connect'
export const CONNECT_FAILURE = '[Failure] Connect'

export function connectRequest() {
  return {
    type: CONNECT_REQUEST
  }
}

export function connectSuccess(address, network) {
  return {
    type: CONNECT_SUCCESS,
    address,
    network
  }
}

export function connectFailure(error) {
  return {
    type: CONNECT_FAILURE,
    error
  }
}

export function connect() {
  return async (dispatch, getState, api) => {
    const contractAddress = getAddress(getState())
    if (!contractAddress || !isValidAddress(contractAddress)) {
      return
    }
    dispatch(connectRequest())
    try {
      const address = await api.connect()
      const network = await api.getNetwork()
      dispatch(connectSuccess(address, network))
      dispatch(fetchContract())
      dispatch(fetchTicker())
      return address
    } catch (e) {
      dispatch(connectFailure(e.message))
    }
  }
}
