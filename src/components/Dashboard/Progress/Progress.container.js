import { connect } from 'react-redux'
import { getContract } from 'modules/contract/selectors'
import { getTicker } from 'modules/ticker/selectors'
import Progress from './Progress'

export const mapState = state => {
  return {
    ticker: getTicker(state),
    contract: getContract(state)
  }
}

export const mapDispatch = dispatch => ({})

export default connect(mapState, mapDispatch)(Progress)
