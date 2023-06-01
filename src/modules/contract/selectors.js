export const getState = (state) => state.app.contract
export const getContract = (state) => getState(state).data
export const isLoading = (state) => getState(state).loading
export const getError = (state) => getState(state).error

export const getAddress = (state) => (state.routing.location ? state.routing.location.pathname.slice(1) : null)
