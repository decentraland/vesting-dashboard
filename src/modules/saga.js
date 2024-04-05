import { all } from 'redux-saga/effects'
import { walletSaga } from './wallet/sagas'
import { createProfileSaga } from 'decentraland-dapps/dist/modules/profile/sagas'
import { transactionSaga } from 'decentraland-dapps/dist/modules/transaction/sagas'
import { createTranslationSaga } from 'decentraland-dapps/dist/modules/translation/sagas'

import * as translations from './locales'

const translationSaga = createTranslationSaga({
  translations,
})

export function* rootSaga() {
  yield all([
    walletSaga(),
    createProfileSaga({ peerUrl: 'https://peer.decentral.io' }),
    transactionSaga(),
    translationSaga(),
  ])
}
