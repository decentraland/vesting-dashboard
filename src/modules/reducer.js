import contract from './contract/reducer'
import ethereum from './ethereum/reducer'
import ticker from './ticker/reducer'
import { walletReducer as wallet } from 'decentraland-dapps/dist/modules/wallet/reducer'
import { combineReducers } from 'redux'
export default combineReducers({
  contract,
  ethereum,
  ticker,
  wallet,
})
