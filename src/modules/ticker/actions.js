// Fetch Ticker
export const FETCH_TICKER_REQUEST = '[Request] Fetch Ticker'
export const FETCH_TICKER_SUCCESS = '[Success] Fetch Ticker'
export const FETCH_TICKER_FAILURE = '[Failure] Fetch Ticker'

export function fetchTickerRequest() {
  return {
    type: FETCH_TICKER_REQUEST,
  }
}

export function fetchTickerSuccess(ticker) {
  return {
    type: FETCH_TICKER_SUCCESS,
    ticker,
  }
}

export function fetchTickerFailure(error) {
  return {
    type: FETCH_TICKER_FAILURE,
    error,
  }
}

export function fetchTicker() {
  return async (dispatch, getState, api) => {
    dispatch(fetchTickerRequest())
    try {
      const ticker = await api.fetchTicker('decentraland')
      dispatch(fetchTickerSuccess(ticker))
      return ticker
    } catch (error) {
      dispatch(fetchTickerFailure(error.message))
    }
  }
}
