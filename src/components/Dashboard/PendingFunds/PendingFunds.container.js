import { connect } from 'react-redux'
import {
  getContract,
  getPendingFunds,
} from '../../../modules/contract/selectors'
import PendingFunds from './PendingFunds'

export const mapState = (state) => {
  return {
    contract: getContract(state),
    pendingFunds: getPendingFunds(state),
  }
}

export default connect(mapState, null)(PendingFunds)
