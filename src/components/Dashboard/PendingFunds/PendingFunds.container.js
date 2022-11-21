import { connect } from 'react-redux'
import {
  getContract,
  getPendingFunds,
  getVersion,
} from '../../../modules/contract/selectors'
import PendingFunds from './PendingFunds'

export const mapState = (state) => {
  return {
    contract: getContract(state),
    version: getVersion(state),
    pendingFunds: getPendingFunds(state),
  }
}

export default connect(mapState, null)(PendingFunds)
