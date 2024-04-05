import { createLogger } from 'redux-logger'
import { createRootReducer } from './reducer'
import createSagasMiddleware from 'redux-saga'
import { createStorageMiddleware } from 'decentraland-dapps/dist/modules/storage/middleware'
import { rootSaga } from './saga'

// export default function configureStore(history, initialState) {
//   // reducer
//   const reducer = combineReducers({
//     app: appReducer,
//     routing: routerReducer,
//     wallet,
//     profile,
//     transaction,
//     translation,
//     storage,
//   })

//   // middleware
//   const api = new API()
//   const router = routerMiddleware(history)
//   const logger = createLogger({
//     predicate: () => true,
//     collapsed: () => true,
//   })

//   // create the saga middleware
//   const sagaMiddleware = createSagasMiddleware()
//   const transactionMiddleware = createTransactionMiddleware()
//   const { storageMiddleware, loadStorageMiddleware } = createStorageMiddleware({
//     storageKey: 'dcl-vesting-dashboard',
//   })

//   const middleware = applyMiddleware(
//     thunk.withExtraArgument(api),
//     router,
//     logger,
//     sagaMiddleware,
//     transactionMiddleware,
//     storageMiddleware
//   )

//   // enhancer
//   const devtools = window.devToolsExtension ? window.devToolsExtension() : (f) => f
//   const enhancer = compose(middleware, devtools)

//   // store
//   const store = createStore(reducer, initialState, enhancer)
//   api.setStore(store)

//   // then run the saga
//   sagaMiddleware.run(rootSaga)

//   loadStorageMiddleware(store)

//   return store
// }

export function initStore() {
  const sagasMiddleware = createSagasMiddleware()
  // const isDev = config.is(Env.DEVELOPMENT)
  const isDev = true // Add ui-env
  const loggerMiddleware = createLogger({
    collapsed: () => true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    predicate: (_: any, action: any) => isDev || action.type.includes('Failure'),
  })
  // const analyticsMiddleware = createAnalyticsMiddleware(config.get('SEGMENT_API_KEY'))
  const { storageMiddleware, loadStorageMiddleware } = createStorageMiddleware({
    storageKey: 'dcl-vesting-dashboard', // this is the key used to save the state in localStorage (required)
    paths: [], // array of paths from state to be persisted (optional)
    actions: [], // array of actions types that will trigger a SAVE (optional)
    migrations: {}, // migration object that will migrate your localstorage (optional)
  })
  const store = createRootReducer([sagasMiddleware, loggerMiddleware, storageMiddleware])
  if (isDev) {
    const _window = window as any
    // eslint-disable-next-line @typescript-eslint/unbound-method
    _window.getState = store.getState
  }

  sagasMiddleware.run(rootSaga)
  loadStorageMiddleware(store)

  return store
}
