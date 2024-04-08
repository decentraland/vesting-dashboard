import { connect } from 'react-redux'
import { release } from '../../../modules/contract/actions'
import Details from './Details'

export const mapDispatch = (dispatch) => ({
  onRelease: () => dispatch(release()),
})

export default connect(null, mapDispatch)(Details)
