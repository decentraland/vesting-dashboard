import { CONNECT_REQUEST, CONNECT_SUCCESS, CONNECT_FAILURE } from './actions'

export const INITIAL_STATE = {
  data: {
    address: null
  },
  loading: false,
  error: null
}

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CONNECT_REQUEST: {
      return {
        ...state,
        error: null,
        loading: true
      }
    }
    case CONNECT_SUCCESS: {
      return {
        ...state,
        error: null,
        loading: false,
        data: {
          ...state.data,
          address: action.address.toLowerCase(),
          network: action.network
        }
      }
    }
    case CONNECT_FAILURE: {
      return {
        ...state,
        loading: false,
        error: action.error
      }
    }
    case '@@router/LOCATION_CHANGE': {
      return {
        ...state,
        error: null
      }
    }
    default:
      return state
  }
}
