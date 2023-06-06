import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import appReducer from './reducer'
import { walletReducer as wallet } from 'decentraland-dapps/dist/modules/wallet/reducer'
import thunk from 'redux-thunk'
import API from './api'
import createSagaMiddleware from 'redux-saga'
import { rootSaga as appSaga } from './saga'

export default function configureStore(history, initialState) {
  // reducer
  const reducer = combineReducers({
    app: appReducer,
    routing: routerReducer,
    wallet,
  })

  // middleware
  const api = new API()
  const router = routerMiddleware(history)
  const logger = createLogger({
    predicate: () => true,
    collapsed: () => true,
  })

  // create the saga middleware
  const sagaMiddleware = createSagaMiddleware()

  const middleware = applyMiddleware(thunk.withExtraArgument(api), router, logger, sagaMiddleware)

  // enhancer
  const devtools = window.devToolsExtension ? window.devToolsExtension() : (f) => f
  const enhancer = compose(middleware, devtools)

  // store
  const store = createStore(reducer, initialState, enhancer)
  api.setStore(store)

  // then run the saga
  sagaMiddleware.run(appSaga)

  return store
}
