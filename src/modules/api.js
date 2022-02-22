import { getAddress } from 'modules/contract/selectors'
import { getAddress as getFrom } from 'modules/ethereum/selectors'
import Web3 from 'web3'
import manaAbi from '../abi/mana.json'
import vestingAbi from '../abi/vesting.json'

let mana, vesting

export default class API {
  store = null

  setStore(store) {
    this.store = store
  }

  async connect() {
    const state = this.store.getState()
    const address = getAddress(state)

    const ethereum = window.ethereum
    const accounts = await ethereum.request({ method: 'eth_accounts' })
    const localWallet = accounts[0]

    const web3 = new Web3(ethereum)
    mana = new web3.eth.Contract(manaAbi, '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942')
    vesting = new web3.eth.Contract(vestingAbi, address)

    return localWallet
  }

  async fetchContract() {
    const state = this.store.getState();
    const address = getAddress(state);

    // await vesting.methods.token().call() // Returns token address of the vesting contract

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
      start,
    ] = await Promise.all([
      mana.methods.balanceOf(address).call(),
      vesting.methods.duration().call(),
      vesting.methods.cliff().call(),
      vesting.methods.beneficiary().call(),
      vesting.methods.vestedAmount().call(),
      vesting.methods.releasableAmount().call(),
      vesting.methods.revoked().call(),
      vesting.methods.revocable().call(),
      vesting.methods.owner().call(),
      vesting.methods.released().call(),
      vesting.methods.start().call(),
    ]);

    const contract = {
      address,
      balance: parseInt(balance, 10) / 1e18,
      duration: parseInt(duration, 10),
      cliff: parseInt(cliff, 10),
      beneficiary,
      vestedAmount: parseInt(vestedAmount, 10) / 1e18,
      releasableAmount: parseInt(releasableAmount, 10) / 1e18,
      revoked,
      revocable,
      owner,
      released: parseInt(released, 10) / 1e18,
      start: parseInt(start, 10),
    };

    return contract;
  }

  release() {
    const state = this.store.getState()
    const from = getFrom(state)
    return vesting.methods.release().send({ from })
  }

  changeBeneficiary(address) {
    const state = this.store.getState()
    const from = getFrom(state)
    return vesting.methods.changeBeneficiary(address).send({ from })
  }

  async fetchTicker(ticker = 'decentraland') {
    try {
      const resp = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ticker}&vs_currencies=usd`, {
        mode: 'cors',
      })
      const json = await resp.json()
      const { usd } = json[ticker]
      return usd
    } catch (e) {
      return 0
    }
  }

  async getNetwork() {
    const web3 = new Web3(window.ethereum)
    const chainId = await web3.eth.getChainId()
    return { name: chainId === 1 ? 'mainnet' : 'unknown', chainId }
  }
}
