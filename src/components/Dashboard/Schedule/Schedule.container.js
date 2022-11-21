import { connect } from 'react-redux'
import { getContract } from '../../../modules/contract/selectors'
import Schedule from './Schedule'

export const mapState = (state) => {
  const contract = getContract(state)

  return {
    contract: contract,
  }
}

export default connect(mapState)(Schedule)
