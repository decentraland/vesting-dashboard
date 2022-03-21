import { OPEN_CHANGE_BENEFICIARY_MODAL, CLOSE_CHANGE_BENEFICIARY_MODAL } from './actions'
import {
  CHANGE_BENEFICIARY_SUCCESS,
  CHANGE_BENEFICIARY_FAILURE,
} from '../contract/actions'

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
    case CHANGE_BENEFICIARY_SUCCESS:
    case CHANGE_BENEFICIARY_FAILURE:
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
