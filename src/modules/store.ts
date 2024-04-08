import { createLogger } from 'redux-logger'
import { createRootReducer } from './reducer'
import createSagasMiddleware from 'redux-saga'
import { createStorageMiddleware } from 'decentraland-dapps/dist/modules/storage/middleware'
import { rootSaga } from './saga'
import { config } from '../config/config'
import { Env } from '@dcl/ui-env'

export function initStore() {
  const sagasMiddleware = createSagasMiddleware()
  const isDev = config.is(Env.DEVELOPMENT)
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
