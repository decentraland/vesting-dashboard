import { configureStore, Reducer, Middleware, AnyAction, combineReducers, Store } from '@reduxjs/toolkit'
import {
  StorageState,
  storageReducer as storage,
  storageReducerWrapper,
} from 'decentraland-dapps/dist/modules/storage/reducer'
import {
  TransactionState,
  transactionReducer as transaction,
} from 'decentraland-dapps/dist/modules/transaction/reducer'
import {
  TranslationState,
  translationReducer as translation,
} from 'decentraland-dapps/dist/modules/translation/reducer'
import { WalletState, walletReducer as wallet } from 'decentraland-dapps/dist/modules/wallet/reducer'

import { tickerReducer as ticker, TickerState } from './ticker/reducer'
import { identityReducer as identity, IdentityState } from './identity/reducer'

export const createRootReducer = (middlewares: Middleware[], preloadedState = {}) =>
  configureStore({
    reducer: storageReducerWrapper(
      combineReducers<RootState>({
        ticker,
        wallet,
        storage,
        translation: translation as Reducer<TranslationState, AnyAction>,
        identity,
        transaction,
      })
    ),
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: false,
        serializableCheck: {
          // Ignore these action types
          ignoredActions: [
            '[Request] Login',
            '[Success] Login',
            'Open modal',
            'REDUX_PERSISTENCE_SAVE',
            'REDUX_PERSISTENCE_LOAD',
          ],
          ignoredPaths: ['modal', 'identity'],
        },
      }).concat(middlewares),
  })

// We need to build the Store type manually due to the storageReducerWrapper function not propagating the type correctly
export type RootState = {
  ticker: TickerState
  identity: IdentityState
  storage: StorageState
  translation: TranslationState
  wallet: WalletState
  transaction: TransactionState
}

export type RootStore = Store<RootState>
export type RootReducer = Reducer<RootState>
