import { FETCH_TICKER_REQUEST, FETCH_TICKER_SUCCESS, FETCH_TICKER_FAILURE } from './actions'

export type TickerState = {
  data: any
  loading: boolean
  error: string
}

export const INITIAL_STATE = {
  data: null,
  loading: false,
  error: null,
}

export function tickerReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_TICKER_REQUEST: {
      return {
        ...state,
        error: null,
        loading: true,
      }
    }
    case FETCH_TICKER_SUCCESS: {
      return {
        ...state,
        error: null,
        loading: false,
        data: action.ticker,
      }
    }
    case FETCH_TICKER_FAILURE: {
      return {
        ...state,
        loading: false,
        error: action.error,
      }
    }
    default:
      return state
  }
}
