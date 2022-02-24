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
});

export const TokenAddress = {
  MANA: "0x0f5d2fb29fb7d3cfee444a200298f468908cc942",
  DAI: "0x6b175474e89094c44da98b954eedeac495271d0f",
  USDT: "0xdac17f958d2ee523a2206206994597c13d831ec7",
  USDC: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
};