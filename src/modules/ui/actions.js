export const OPEN_CHANGE_BENEFICIARY_MODAL = '[Open] Change Beneficiary Modal'
export const CLOSE_CHANGE_BENEFICIARY_MODAL = '[Close] Change Beneficiary Modal'

export function openChangeBeneficiaryModal() {
  return {
    type: OPEN_CHANGE_BENEFICIARY_MODAL
  }
}

export function closeChangeBeneficiaryModal() {
  return {
    type: CLOSE_CHANGE_BENEFICIARY_MODAL
  }
}
