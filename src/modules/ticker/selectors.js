export const getState = (state) => state.ticker
export const getTicker = (state) => getState(state).data
export const isLoading = (state) => getState(state).loading
export const getError = (state) => getState(state).error
