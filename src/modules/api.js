import { eth } from 'decentraland-commons'
import { MANAToken, DecentralandVesting } from 'decentraland-commons/dist/contracts'
import { getAddress } from 'modules/contract/selectors'

let mana, vesting

export default class API {
  store = null

  setStore(store) {
    this.store = store
  }

  async connect() {
    const state = this.store.getState()
    const address = getAddress(state)

    mana = new MANAToken()
    vesting = new DecentralandVesting(address)

    const connected = await eth.connect({ contracts: [mana, vesting] })
    if (!connected) {
      throw new Error('Could not connect to Ethereum')
    }
    return eth.getAddress()
  }

  async fetchContract() {
    const state = this.store.getState()
    const address = getAddress(state)

    const [
      balance,
      duration,
      cliff,
      beneficiary,
      vestedAmount,
      releasableAmount,
      revoked,
      revocable,
      owner,
      released,
      start
    ] = await Promise.all([
      mana.getBalance(address),
      vesting.getDuration(),
      vesting.getCliff(),
      vesting.getBeneficiary(),
      vesting.getVestedAmount(),
      vesting.getReleasableAmount(),
      vesting.isRevoked(),
      vesting.isRevocable(),
      vesting.getOwner(),
      vesting.getReleased(),
      vesting.getStart()
    ])

    const contract = {
      address,
      balance,
      duration,
      cliff,
      beneficiary,
      vestedAmount,
      releasableAmount,
      revoked,
      revocable,
      owner,
      released,
      start
    }

    return contract
  }

  release() {
    return vesting.release()
  }

  async fetchTicker(ticker = 'decentraland') {
    const resp = await fetch(`https://api.coinmarketcap.com/v1/ticker/${ticker}/`, { mode: 'cors' })
    const json = await resp.json()
    return json[0]
  }

  async getNetwork() {
    return eth.getNetwork()
  }
}
