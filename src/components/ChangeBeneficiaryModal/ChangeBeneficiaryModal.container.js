import { connect } from 'react-redux'
import { changeBeneficiary } from 'modules/contract/actions'
import { closeChangeBeneficiaryModal } from 'modules/ui/actions'
import { isChangeBeneficiaryModalOpen } from 'modules/ui/selectors'
import ChangeBeneficiaryModal from './ChangeBeneficiaryModal'

export const mapState = state => {
  return {
    isOpen: isChangeBeneficiaryModalOpen(state)
  }
}

export const mapDispatch = dispatch => ({
  onSubmit: address => dispatch(changeBeneficiary(address)),
  onClose: () => dispatch(closeChangeBeneficiaryModal())
})

export default connect(mapState, mapDispatch)(ChangeBeneficiaryModal)
