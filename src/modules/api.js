import { getAddress, getContract } from './contract/selectors'
import { getAddress as getFrom } from './ethereum/selectors'
import Web3 from 'web3'
import Big from 'big.js'
import manaAbi from '../abi/mana.json'
import daiAbi from '../abi/dai.json'
import usdtAbi from '../abi/usdt.json'
import usdcAbi from '../abi/usdc.json'
import vestingAbi from '../abi/vesting.json'
import periodicTokenVestingAbi from '../abi/periodicTokenVesting.json'
import {
  ContractVersion,
  TokenAddressByChainId,
  TopicByVersion,
} from './constants'

let vesting, tokenContracts
export default class API {
  store = null
  web3 = null
  localWallet = null

  setStore(store) {
    this.store = store
  }

  getWeb3() {
    if (this.web3 === null) {
      this.web3 = new Web3(
        new Web3.providers.HttpProvider('https://rpc.decentraland.org/mainnet')
      )
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

    const eth = this.getEth()
    const chainId = await eth.getChainId()
    const TokenAddress = TokenAddressByChainId[chainId]

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
    const eth = this.getEth()

    let version

    try {
      vesting = new eth.Contract(periodicTokenVestingAbi, address)
      await vesting.methods.getIsLinear().call()
      version = ContractVersion.V2
    } catch (e) {
      vesting = new eth.Contract(vestingAbi, address)
      version = ContractVersion.V1
    }

    let tokenContractAddress

    if (version === ContractVersion.V1) {
      tokenContractAddress = await vesting.methods.token().call()
    } else {
      tokenContractAddress = await vesting.methods.getToken().call()
    }

    tokenContractAddress = tokenContractAddress.toLowerCase()

    if (!(tokenContractAddress in tokenContracts)) {
      throw new Error('Token not supported')
    }

    const decimals = await tokenContracts[tokenContractAddress].methods
      .decimals()
      .call()

    const promises = {
      v1: {
        duration: () => vesting.methods.duration().call(),
        cliff: () => vesting.methods.cliff().call(),
        beneficiary: () => vesting.methods.beneficiary().call(),
        vestedAmount: () => vesting.methods.vestedAmount().call(),
        releasableAmount: () => vesting.methods.releasableAmount().call(),
        revoked: () => vesting.methods.revoked().call(),
        revocable: () => vesting.methods.revocable().call(),
        released: () => vesting.methods.released().call(),
        start: () => vesting.methods.start().call(),
        periodDuration: () => Promise.resolve('0'),
        vestedPerPeriod: () => Promise.resolve([]),
        paused: () => Promise.resolve(false),
        pausable: () => Promise.resolve(false),
        stop: () => Promise.resolve('0'),
        linear: () => Promise.resolve(false),
      },
      v2: {
        duration: () => Promise.resolve('0'),
        cliff: () => vesting.methods.getCliff().call(),
        beneficiary: () => vesting.methods.getBeneficiary().call(),
        vestedAmount: () => vesting.methods.getVested().call(),
        releasableAmount: () => vesting.methods.getReleasable().call(),
        revoked: () => vesting.methods.getIsRevoked().call(),
        revocable: () => vesting.methods.getIsRevocable().call(),
        released: () => vesting.methods.getReleased().call(),
        start: () => vesting.methods.getStart().call(),
        periodDuration: () => vesting.methods.getPeriod().call(),
        vestedPerPeriod: () => vesting.methods.getVestedPerPeriod().call(),
        paused: () => vesting.methods.paused().call(),
        pausable: () => vesting.methods.getIsPausable().call(),
        stop: () => vesting.methods.getStop().call(),
        linear: () => vesting.methods.getIsLinear().call(),
      },
    }

    const [
      symbol,
      balance,
      logs,
      owner,
      duration,
      cliff,
      beneficiary,
      vestedAmount,
      releasableAmount,
      revoked,
      revocable,
      released,
      start,
      periodDuration,
      vestedPerPeriod,
      paused,
      pausable,
      stop,
      linear,
    ] = await Promise.all([
      tokenContracts[tokenContractAddress].methods.symbol().call(),
      tokenContracts[tokenContractAddress].methods.balanceOf(address).call(),
      this.getLogs(decimals, version),
      vesting.methods.owner().call(),
      promises[version].duration(),
      promises[version].cliff(),
      promises[version].beneficiary(),
      promises[version].vestedAmount(),
      promises[version].releasableAmount(),
      promises[version].revoked(),
      promises[version].revocable(),
      promises[version].released(),
      promises[version].start(),
      promises[version].periodDuration(),
      promises[version].vestedPerPeriod(),
      promises[version].paused(),
      promises[version].pausable(),
      promises[version].stop(),
      promises[version].linear(),
    ])

    const contract = {
      version,
      symbol,
      address,
      balance: parseInt(balance, 10) / 10 ** decimals,
      duration:
        version === ContractVersion.V1
          ? parseInt(duration, 10)
          : vestedPerPeriod.length * parseInt(periodDuration, 10),
      cliff:
        version === ContractVersion.V1
          ? parseInt(cliff, 10)
          : parseInt(cliff, 10) + parseInt(start, 10),
      beneficiary,
      vestedAmount: parseInt(vestedAmount, 10) / 10 ** decimals,
      releasableAmount: parseInt(releasableAmount, 10) / 10 ** decimals,
      revoked,
      revocable,
      owner,
      released: parseInt(released, 10) / 10 ** decimals,
      start: parseInt(start, 10),
      logs,
      periodDuration,
      vestedPerPeriod: vestedPerPeriod.map(
        (amount) => parseInt(amount, 10) / 10 ** decimals
      ),
      paused,
      pausable,
      stop: parseInt(stop, 10),
      linear,
    }

    contract.total =
      version === ContractVersion.V1
        ? contract.balance + contract.released
        : contract.vestedPerPeriod.reduce((a, b) => a + b, 0)

    return contract
  }

  async getLogs(decimals, version) {
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

    const Topic = TopicByVersion[version]

    for (const idx in web3Logs) {
      switch (web3Logs[idx].topics[0]) {
        case Topic.TRANSFER_OWNERSHIP:
          logs.push(
            this.getTransferOwnershipLog(
              [...web3Logs[idx].topics],
              blocks[idx].timestamp,
              Topic
            )
          )
          break
        case Topic.RELEASE:
          logs.push(
            this.getReleaseLog(
              decimals,
              web3Logs[idx].data,
              cumulativeReleased,
              blocks[idx].timestamp,
              version,
              Topic
            )
          )
          cumulativeReleased = web3Logs[idx].data
          break
        case Topic.REVOKE:
          logs.push(this.getRevokeLog(blocks[idx].timestamp, Topic))
          break
        case Topic.PAUSED:
          logs.push(this.getPausedLog(blocks[idx].timestamp, Topic))
          break
        case Topic.UNPAUSED:
          logs.push(this.getUnpausedLog(blocks[idx].timestamp, Topic))
          break
        default:
          break
      }
    }

    return logs
  }

  getTransferOwnershipLog(topics, timestamp, Topic) {
    return {
      topic: Topic.TRANSFER_OWNERSHIP,
      data: {
        previousOwner: topics[1].slice(0, 2) + topics[1].slice(26),
        newOwner: topics[2].slice(0, 2) + topics[2].slice(26),
        timestamp: timestamp,
      },
    }
  }

  getReleaseLog(decimals, data, cumulativeReleased, timestamp, version, Topic) {
    const cumulative = Big(Number(cumulativeReleased) || 0).div(10 ** decimals)

    let totalReleased
    let currentReleased

    if (version === ContractVersion.V1) {
      totalReleased = Big(Number(data) || 0).div(10 ** decimals)
      currentReleased = totalReleased.minus(cumulative)
    } else {
      currentReleased = Big(Number(data) || 0).div(10 ** decimals)
      totalReleased = Big(Number(cumulativeReleased) || 0)
        .div(10 ** decimals)
        .add(currentReleased)
    }

    return {
      topic: Topic.RELEASE,
      data: {
        amount: currentReleased.toNumber(),
        acum: totalReleased.toNumber(),
        timestamp: timestamp,
      },
    }
  }

  getRevokeLog(timestamp, Topic) {
    return {
      topic: Topic.REVOKE,
      data: {
        timestamp: timestamp,
      },
    }
  }

  getPausedLog(timestamp, Topic) {
    return {
      topic: Topic.PAUSED,
      data: {
        timestamp: timestamp,
      },
    }
  }

  getUnpausedLog(timestamp, Topic) {
    return {
      topic: Topic.UNPAUSED,
      data: {
        timestamp: timestamp,
      },
    }
  }

  async release() {
    const state = this.store.getState()
    const contract = getContract(state)
    const from = getFrom(state)

    if (contract.version === ContractVersion.V1) {
      return vesting.methods.release().send({ from })
    }

    const releasableAmount = await vesting.methods.getReleasable().call()

    return vesting.methods.release(from, releasableAmount).send({ from })
  }

  changeBeneficiary(address) {
    const state = this.store.getState()
    const contract = getContract(state)
    const from = getFrom(state)

    return contract.version === ContractVersion.V1
      ? vesting.methods.changeBeneficiary(address).send({ from })
      : vesting.methods.setBeneficiary(address).send({ from })
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
    return { name: chainId === 1 ? 'mainnet' : 'unknown', chainId }
  }
}
