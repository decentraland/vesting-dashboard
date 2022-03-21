import { shape, string, number, bool } from 'prop-types'

export const ContractType = shape({
  symbol: string.isRequired,
  address: string.isRequired,
  balance: number.isRequired,
  duration: number.isRequired,
  cliff: number.isRequired,
  beneficiary: string.isRequired,
  vestedAmount: number.isRequired,
  releasableAmount: number.isRequired,
  revoked: bool.isRequired,
  revocable: bool.isRequired,
  owner: string.isRequired,
  released: number.isRequired,
  start: number.isRequired,
})