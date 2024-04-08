import { connect } from 'react-redux'
import { getTicker } from '../../../modules/ticker/selectors'
import Summary from './Summary'

export const mapState = (state) => {
  return {
    ticker: getTicker(state),
  }
}

export default connect(mapState)(Summary)
