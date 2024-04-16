/* eslint-disable no-case-declarations */
import Web3 from 'web3'
import Big from 'big.js'
import manaAbi from '../abi/mana.json'
import daiAbi from '../abi/dai.json'
import usdtAbi from '../abi/usdt.json'
import usdcAbi from '../abi/usdc.json'
import vestingAbi from '../abi/vesting.json'
import periodicTokenVestingAbi from '../abi/periodicTokenVesting.json'
import { ContractVersion, TokenAddressByChainId, TopicByVersion } from './constants'
import { getDaysFromRevoke, getDurationInDays } from '../components/Dashboard/Chart/utils'

let vesting

export async function fetchTicker(ticker = 'decentraland') {
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

export async function fetchTokenContracts(chainId = 1) {
  if (chainId !== 1) {
    throw new Error(`Unsupported chain id ${chainId}`)
  }

  const eth = getEth()
  const TokenAddress = TokenAddressByChainId[chainId]

  return {
    [TokenAddress.MANA]: new eth.Contract(manaAbi, TokenAddress.MANA),
    [TokenAddress.DAI]: new eth.Contract(daiAbi, TokenAddress.DAI),
    [TokenAddress.USDT]: new eth.Contract(usdtAbi, TokenAddress.USDT),
    [TokenAddress.USDC]: new eth.Contract(usdcAbi, TokenAddress.USDC),
  }
}

function getEth() {
  return new Web3(new Web3.providers.HttpProvider('https://rpc.decentraland.org/mainnet')).eth
}

export async function fetchContract(address, tokenContracts) {
  const eth = getEth()

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

  const decimals = await tokenContracts[tokenContractAddress].methods.decimals().call()

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
      linear: () => Promise.resolve(true),
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
    getLogs(address, decimals, version),
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
      version === ContractVersion.V1 ? parseInt(duration, 10) : vestedPerPeriod.length * parseInt(periodDuration, 10),
    cliff: version === ContractVersion.V1 ? parseInt(cliff, 10) : parseInt(cliff, 10) + parseInt(start, 10),
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
    vestedPerPeriod: vestedPerPeriod.map((amount) => parseInt(amount, 10) / 10 ** decimals),
    paused,
    pausable,
    stop: parseInt(stop, 10),
    linear,
  }

  const getTotal = () => {
    if (version === ContractVersion.V1) {
      if (contract.revoked) {
        const revokeLog = contract.logs.find((log) => log.topic === TopicByVersion[version].REVOKE)
        const { timestamp } = revokeLog.data
        const daysFromRevoke = getDaysFromRevoke(timestamp, contract.start)
        const durationInDays = getDurationInDays(contract.duration)

        const projectedTotal = (contract.vestedAmount / daysFromRevoke) * durationInDays

        return Math.floor(projectedTotal / 100) * 100
      }
      return contract.balance + contract.released
    }

    return contract.vestedPerPeriod.reduce((a, b) => a + b, 0)
  }

  contract.total = getTotal()

  return contract
}

async function getLogs(address, decimals, version) {
  const eth = getEth()

  const web3Logs = await eth.getPastLogs({
    address: address,
    fromBlock: 0,
    toBlock: 'latest',
  })

  const blocks = await Promise.all(web3Logs.map((log) => eth.getBlock(log.blockNumber)))
  const logs = []
  let cumulativeReleased = 0

  const Topic = TopicByVersion[version]

  for (const idx in web3Logs) {
    switch (web3Logs[idx].topics[0]) {
      case Topic.TRANSFER_OWNERSHIP:
        logs.push(getTransferOwnershipLog([...web3Logs[idx].topics], blocks[idx].timestamp, Topic))
        break
      case Topic.RELEASE:
        const log = getReleaseLog(
          decimals,
          web3Logs[idx].data,
          cumulativeReleased,
          blocks[idx].timestamp,
          version,
          Topic
        )
        logs.push(log)
        cumulativeReleased = Big(log.data.acum)
          .mul(10 ** decimals)
          .toNumber()
        break
      case Topic.REVOKE:
        logs.push(getRevokeLog(blocks[idx].timestamp, Topic))
        break
      case Topic.PAUSED:
        logs.push(getPausedLog(blocks[idx].timestamp, Topic))
        break
      case Topic.UNPAUSED:
        logs.push(getUnpausedLog(blocks[idx].timestamp, Topic))
        break
      default:
        break
    }
  }

  return logs
}

function getTransferOwnershipLog(topics, timestamp, Topic) {
  return {
    topic: Topic.TRANSFER_OWNERSHIP,
    data: {
      previousOwner: topics[1].slice(0, 2) + topics[1].slice(26),
      newOwner: topics[2].slice(0, 2) + topics[2].slice(26),
      timestamp: timestamp,
    },
  }
}

function getReleaseLog(decimals, data, cumulativeReleased, timestamp, version, Topic) {
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

function getRevokeLog(timestamp, Topic) {
  return {
    topic: Topic.REVOKE,
    data: {
      timestamp: timestamp,
    },
  }
}

function getPausedLog(timestamp, Topic) {
  return {
    topic: Topic.PAUSED,
    data: {
      timestamp: timestamp,
    },
  }
}

function getUnpausedLog(timestamp, Topic) {
  return {
    topic: Topic.UNPAUSED,
    data: {
      timestamp: timestamp,
    },
  }
}

export async function release(from, contract) {
  if (contract.version === ContractVersion.V1) {
    return vesting.methods.release().send({ from })
  }

  const releasableAmount = await vesting.methods.getReleasable().call()

  return vesting.methods.release(from, releasableAmount).send({ from })
}

export function changeBeneficiary(from, contract) {
  const { version, address } = contract

  return version === ContractVersion.V1
    ? vesting.methods.changeBeneficiary(address).send({ from })
    : vesting.methods.setBeneficiary(address).send({ from })
}
