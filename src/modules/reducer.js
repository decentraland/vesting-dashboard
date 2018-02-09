import contract from './contract/reducer'
import ethereum from './ethereum/reducer'
import ticker from './ticker/reducer'
import ui from './ui/reducer'
import { combineReducers } from 'redux'
export default combineReducers({
  contract,
  ethereum,
  ticker,
  ui
})
