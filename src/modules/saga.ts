import { all } from 'redux-saga/effects'
import { transactionSaga } from 'decentraland-dapps/dist/modules/transaction/sagas'
import { createTranslationSaga } from 'decentraland-dapps/dist/modules/translation/sagas'
import { createWalletSaga } from 'decentraland-dapps/dist/modules/wallet/sagas'
import * as translations from './locales'
import { config } from '../config/config'
import { identitySaga } from './identity/sagas'
import { createAnalyticsSaga } from 'decentraland-dapps/dist/modules/analytics'

const analyticsSaga = createAnalyticsSaga()
const translationSaga = createTranslationSaga({
  translations,
})

export function* rootSaga() {
  yield all([
    analyticsSaga(),
    createWalletSaga({
      CHAIN_ID: Number(config.get('CHAIN_ID')),
      POLL_INTERVAL: 0,
      TRANSACTIONS_API_URL: 'https://transactions-api.decentraland.org/v1',
    })(),
    identitySaga(),
    translationSaga(),
    transactionSaga(),
  ])
}
