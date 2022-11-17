import { getAddress } from './contract/selectors'
import { getAddress as getFrom } from './ethereum/selectors'
import Web3 from 'web3'
import manaAbi from '../abi/mana.json'
import daiAbi from '../abi/dai.json'
import usdtAbi from '../abi/usdt.json'
import usdcAbi from '../abi/usdc.json'
import vestingAbi from '../abi/vesting.json'
import { TokenAddress, Topic } from './constants'
import Big from 'big.js'

let vesting, tokenContracts
export default class API {
  store = null
  web3 = null
  localWallet = null

  setStore(store) {
    this.store = store
  }

  async getWeb3() {
    if (this.web3 === null) {
      const network = await this.getNetwork()

      let rpcUrl

      switch (network.name) {
        case 'goerli':
          rpcUrl = 'https://rpc.decentraland.org/goerli'
          break
        default:
          rpcUrl = 'https://rpc.decentraland.org/mainnet'
      }

      this.web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl))
    }

    return this.web3
  }

  getEth() {
    return this.getWeb3().eth
  }

  async logIn() {
    const ethereum = window.ethereum
    await ethereum.enable()
    const accounts = await ethereum.request({ method: 'eth_accounts' })
    this.localWallet = accounts[0]

    this.web3 = new Web3(ethereum)
  }

  async connect() {
    try {
      await this.logIn()
    } catch {
      console.error('Metamask not found')
    }
    const state = this.store.getState()
    const address = getAddress(state)

    const eth = this.getEth()
    vesting = new eth.Contract(vestingAbi, address)
    tokenContracts = {
      [TokenAddress.MANA]: new eth.Contract(manaAbi, TokenAddress.MANA),
      [TokenAddress.DAI]: new eth.Contract(daiAbi, TokenAddress.DAI),
      [TokenAddress.USDT]: new eth.Contract(usdtAbi, TokenAddress.USDT),
      [TokenAddress.USDC]: new eth.Contract(usdcAbi, TokenAddress.USDC),
    }
    return this.localWallet
  }

  async fetchContract() {
    const state = this.store.getState()
    const address = getAddress(state)

    const tokenContractAddress = (
      await vesting.methods.token().call()
    ).toLowerCase()

    if (!(tokenContractAddress in tokenContracts)) {
      throw new Error('Token not supported')
    }

    const decimals = await tokenContracts[tokenContractAddress].methods
      .decimals()
      .call()

    const [
      symbol,
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
      logs,
    ] = await Promise.all([
      tokenContracts[tokenContractAddress].methods.symbol().call(),
      tokenContracts[tokenContractAddress].methods.balanceOf(address).call(),
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
      this.getLogs(decimals),
    ])

    const contract = {
      symbol,
      address,
      balance: parseInt(balance, 10) / 10 ** decimals,
      duration: parseInt(duration, 10),
      cliff: parseInt(cliff, 10),
      beneficiary,
      vestedAmount: parseInt(vestedAmount, 10) / 10 ** decimals,
      releasableAmount: parseInt(releasableAmount, 10) / 10 ** decimals,
      revoked,
      revocable,
      owner,
      released: parseInt(released, 10) / 10 ** decimals,
      start: parseInt(start, 10),
      logs,
    }

    return contract
  }

  async getLogs(decimals) {
    const state = this.store.getState()
    const address = getAddress(state)
    const eth = this.getEth()

    const web3Logs = await eth.getPastLogs({
      address: address,
      fromBlock: 0,
      toBlock: 'latest',
    })

    const blocks = await Promise.all(
      web3Logs.map((log) => eth.getBlock(log.blockNumber))
    )
    const logs = []
    let cumulativeReleased = 0

    for (const idx in web3Logs) {
      switch (web3Logs[idx].topics[0]) {
        case Topic.TRANSFER_OWNERSHIP:
          logs.push(
            this.getTransferOwnershipLog(
              [...web3Logs[idx].topics],
              blocks[idx].timestamp
            )
          )
          break
        case Topic.RELEASE:
          logs.push(
            this.getReleaseLog(
              decimals,
              web3Logs[idx].data,
              cumulativeReleased,
              blocks[idx].timestamp
            )
          )
          cumulativeReleased = web3Logs[idx].data
          break
        case Topic.REVOKE:
          logs.push(this.getRevokeLog(blocks[idx].timestamp))
          break

        default:
          break
      }
    }

    return logs
  }

  getTransferOwnershipLog(topics, timestamp) {
    return {
      topic: Topic.TRANSFER_OWNERSHIP,
      data: {
        previousOwner: topics[1].slice(0, 2) + topics[1].slice(26),
        newOwner: topics[2].slice(0, 2) + topics[2].slice(26),
        timestamp: timestamp,
      },
    }
  }

  getReleaseLog(decimals, data, cumulativeReleased, timestamp) {
    const totalReleased = Big(Number(data) || 0).div(10 ** decimals)
    const cumulative = Big(Number(cumulativeReleased) || 0).div(10 ** decimals)
    const currentReleased = totalReleased.minus(cumulative)
    return {
      topic: Topic.RELEASE,
      data: {
        amount: currentReleased.toNumber(),
        acum: totalReleased.toNumber(),
        timestamp: timestamp,
      },
    }
  }

  getRevokeLog(timestamp) {
    return {
      topic: Topic.REVOKE,
      data: {
        timestamp: timestamp,
      },
    }
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
      const resp = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ticker}&vs_currencies=usd`,
        {
          mode: 'cors',
        }
      )
      const json = await resp.json()
      const { usd } = json[ticker]
      return usd
    } catch (e) {
      return 0
    }
  }

  async getNetwork() {
    const chainId = await this.getEth().getChainId()

    let name

    switch (chainId) {
      case 1:
        name = 'mainnet'
        break
      case 5:
        name = 'goerli'
        break
      default:
        name = 'unknown'
    }

    console.log(name)

    return { name, chainId }
  }
}
