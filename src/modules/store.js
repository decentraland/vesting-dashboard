import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import appReducer from './reducer'
import thunk from 'redux-thunk'
import API from './api'

export default function configureStore(history, initialState) {
  // reducer
  const reducer = combineReducers({
    app: appReducer,
    routing: routerReducer,
  })

  // middleware
  const api = new API()
  const router = routerMiddleware(history)
  const logger = createLogger({
    predicate: () => true,
    collapsed: () => true,
  })
  const middleware = applyMiddleware(thunk.withExtraArgument(api), router, logger)

  // enhancer
  const devtools = window.devToolsExtension ? window.devToolsExtension() : (f) => f
  const enhancer = compose(middleware, devtools)

  // store
  const store = createStore(reducer, initialState, enhancer)
  api.setStore(store)

  return store
}
