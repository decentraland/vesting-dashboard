import { OPEN_CHANGE_BENEFICIARY_MODAL, CLOSE_CHANGE_BENEFICIARY_MODAL } from './actions'

export const INITIAL_STATE = {
  isChangeBeneficiaryModalOpen: false
}

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case OPEN_CHANGE_BENEFICIARY_MODAL: {
      return {
        ...state,
        isChangeBeneficiaryModalOpen: true
      }
    }
    case CLOSE_CHANGE_BENEFICIARY_MODAL: {
      return {
        ...state,
        isChangeBeneficiaryModalOpen: false
      }
    }
    default:
      return state
  }
}
