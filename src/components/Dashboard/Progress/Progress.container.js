import { connect } from 'react-redux'
import { getContract, getVersion } from '../../../modules/contract/selectors'
import Progress from './Progress'

export const mapState = (state) => {
  return {
    contract: getContract(state),
    version: getVersion(state),
  }
}

export default connect(mapState)(Progress)
