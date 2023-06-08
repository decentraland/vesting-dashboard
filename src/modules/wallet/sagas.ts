import { all, takeEvery } from 'redux-saga/effects'
import { createWalletSaga } from 'decentraland-dapps/dist/modules/wallet/sagas'
import {
  CHANGE_ACCOUNT,
  DISCONNECT_WALLET,
  ENABLE_WALLET_SUCCESS,
} from 'decentraland-dapps/dist/modules/wallet/actions'

const baseWalletSaga = createWalletSaga({
  CHAIN_ID: 1,
  POLL_INTERVAL: 0,
})

export function* walletSaga() {
  yield all([baseWalletSaga(), customWalletSaga()])
}

function* customWalletSaga() {
  yield takeEvery(CHANGE_ACCOUNT, handleChangeOrDisconnectAccount)
  yield takeEvery(DISCONNECT_WALLET, handleChangeOrDisconnectAccount)
  yield takeEvery(ENABLE_WALLET_SUCCESS, handleChangeOrDisconnectAccount)
}

// eslint-disable-next-line require-yield
function* handleChangeOrDisconnectAccount() {
  window.location.reload()
}
