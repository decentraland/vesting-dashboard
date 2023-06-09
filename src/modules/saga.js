import { all } from 'redux-saga/effects'
import { walletSaga } from './wallet/sagas'
import { createProfileSaga } from 'decentraland-dapps/dist/modules/profile/sagas'
import { transactionSaga } from 'decentraland-dapps/dist/modules/transaction/sagas'
import { createTranslationSaga } from 'decentraland-dapps/dist/modules/translation/sagas'
import en from 'decentraland-dapps/dist/modules/translation/defaults/en.json'

const translationSaga = createTranslationSaga({
  translations: { en },
})

export function* rootSaga() {
  yield all([
    walletSaga(),
    createProfileSaga({ peerUrl: 'https://peer.decentral.io' }),
    transactionSaga(),
    translationSaga(),
  ])
}
