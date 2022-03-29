import { connect } from 'react-redux'
import { changeBeneficiary } from '../../modules/contract/actions'
import ChangeBeneficiaryModal from './ChangeBeneficiaryModal'

export const mapDispatch = (dispatch) => ({
  onSubmit: (address) => dispatch(changeBeneficiary(address)),
})

export default connect(() => ({}), mapDispatch)(ChangeBeneficiaryModal)
