import { connect } from 'react-redux'
import { TopicByVersion } from '../../../modules/constants'
import { getContract, getVersion } from '../../../modules/contract/selectors'
import Schedule from './Schedule'

export const mapState = (state) => {
  return {
    contract: getContract(state),
    Topic: TopicByVersion[getVersion(state)],
  }
}

export default connect(mapState)(Schedule)
