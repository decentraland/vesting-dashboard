import { CONNECT_REQUEST, CONNECT_SUCCESS, CONNECT_FAILURE } from './actions'

export type EthereumState = {
  data: {
    address: string
  }
  loading: boolean
  error: string
}

export const INITIAL_STATE = {
  data: {
    address: null,
  },
  loading: false,
  error: null,
}

export function ethereumReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CONNECT_REQUEST: {
      return {
        ...state,
        error: null,
        loading: true,
      }
    }
    case CONNECT_SUCCESS: {
      return {
        ...state,
        error: null,
        loading: false,
        data: {
          ...state.data,
          address: action.address?.toLowerCase(),
          network: action.network,
          chainId: action.chainId,
        },
      }
    }
    case CONNECT_FAILURE: {
      return {
        ...state,
        loading: false,
        error: action.error,
      }
    }
    case '@@router/LOCATION_CHANGE': {
      return {
        ...state,
        error: null,
      }
    }
    default:
      return state
  }
}
