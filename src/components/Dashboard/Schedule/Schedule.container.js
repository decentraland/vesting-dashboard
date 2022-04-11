import { connect } from 'react-redux'
import { getContract } from '../../../modules/contract/selectors'
import Schedule from './Schedule'

export const mapState = (state) => {
  return {
    contract: getContract(state),
  }
}

export default connect(mapState)(Schedule)
