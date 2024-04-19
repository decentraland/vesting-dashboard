/* eslint-disable no-case-declarations */
import Big from 'big.js'
import manaAbi from '../abi/mana.json'
import daiAbi from '../abi/dai.json'
import usdtAbi from '../abi/usdt.json'
import usdcAbi from '../abi/usdc.json'
import vestingAbi from '../abi/vesting.json'
import periodicTokenVestingAbi from '../abi/periodicTokenVesting.json'
import { ContractVersion, TokenAddressByChainId, TopicByVersion } from './constants'
import { getDaysFromRevoke, getDurationInDays } from '../components/Dashboard/Chart/utils'
import { JsonRpcProvider } from 'ethers'
import { Contract } from 'ethers'

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
function getEth() {
  return new JsonRpcProvider('https://rpc.decentraland.org/mainnet')
}

export async function fetchTokenContracts(chainId = 1) {
  if (chainId !== 1) {
    throw new Error(`Unsupported chain id ${chainId}`)
  }

  const provider = getEth()
  const TokenAddress = TokenAddressByChainId[chainId]

  return {
    [TokenAddress.MANA]: new Contract(TokenAddress.MANA, manaAbi, provider),
    [TokenAddress.DAI]: new Contract(TokenAddress.DAI, daiAbi, provider),
    [TokenAddress.USDT]: new Contract(TokenAddress.USDT, usdtAbi, provider),
    [TokenAddress.USDC]: new Contract(TokenAddress.USDC, usdcAbi, provider),
  }
}

export async function fetchContract(address, tokenContracts) {
  const provider = getEth()

  let version
  let vesting

  try {
    vesting = new Contract(address, periodicTokenVestingAbi, provider)
    await vesting.getIsLinear()
    version = ContractVersion.V2
  } catch (e) {
    vesting = new Contract(address, vestingAbi, provider)
    version = ContractVersion.V1
  }

  let tokenContractAddress

  if (version === ContractVersion.V1) {
    tokenContractAddress = await vesting.token()
  } else {
    tokenContractAddress = await vesting.getToken()
  }

  tokenContractAddress = tokenContractAddress.toLowerCase()

  if (!(tokenContractAddress in tokenContracts)) {
    throw new Error('Token not supported')
  }

  const decimals = await tokenContracts[tokenContractAddress].decimals()

  const promises = {
    v1: {
      duration: () => vesting.duration(),
      cliff: () => vesting.cliff(),
      beneficiary: () => vesting.beneficiary(),
      vestedAmount: () => vesting.vestedAmount(),
      releasableAmount: () => vesting.releasableAmount(),
      revoked: () => vesting.revoked(),
      revocable: () => vesting.revocable(),
      released: () => vesting.released(),
      start: () => vesting.start(),
      periodDuration: () => Promise.resolve('0'),
      vestedPerPeriod: () => Promise.resolve([]),
      paused: () => Promise.resolve(false),
      pausable: () => Promise.resolve(false),
      stop: () => Promise.resolve('0'),
      linear: () => Promise.resolve(true),
    },
    v2: {
      duration: () => Promise.resolve('0'),
      cliff: () => vesting.getCliff(),
      beneficiary: () => vesting.getBeneficiary(),
      vestedAmount: () => vesting.getVested(),
      releasableAmount: () => vesting.getReleasable(),
      revoked: () => vesting.getIsRevoked(),
      revocable: () => vesting.getIsRevocable(),
      released: () => vesting.getReleased(),
      start: () => vesting.getStart(),
      periodDuration: () => vesting.getPeriod(),
      vestedPerPeriod: () => vesting.getVestedPerPeriod(),
      paused: () => vesting.paused(),
      pausable: () => vesting.getIsPausable(),
      stop: () => vesting.getStop(),
      linear: () => vesting.getIsLinear(),
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
    tokenContracts[tokenContractAddress].symbol(),
    tokenContracts[tokenContractAddress].balanceOf(address),
    getLogs(address, decimals, version),
    vesting.owner(),
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

  const formattedDecimals = Number(decimals)

  const contract = {
    version,
    symbol,
    address,
    balance: Number(balance) / 10 ** formattedDecimals,
    duration:
      version === ContractVersion.V1 ? parseInt(duration, 10) : vestedPerPeriod.length * parseInt(periodDuration, 10),
    cliff: version === ContractVersion.V1 ? parseInt(cliff, 10) : parseInt(cliff, 10) + parseInt(start, 10),
    beneficiary,
    vestedAmount: Number(vestedAmount) / 10 ** formattedDecimals,
    releasableAmount: Number(releasableAmount) / 10 ** formattedDecimals,
    revoked,
    revocable,
    owner,
    released: Number(released) / 10 ** formattedDecimals,
    start: parseInt(start, 10),
    logs,
    periodDuration,
    vestedPerPeriod: vestedPerPeriod.map((amount) => parseInt(amount, 10) / 10 ** formattedDecimals),
    paused,
    pausable,
    stop: parseInt(stop, 10),
    linear,
    total: undefined,
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

  contract.total = Number(getTotal())

  return contract
}

async function getLogs(address, decimals, version) {
  const provider = getEth()

  const web3Logs = await provider.getLogs({
    address: address,
    fromBlock: 0,
    toBlock: 'latest',
  })

  const blocks = await Promise.all(web3Logs.map((log) => provider.getBlock(log.blockNumber)))
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
          .mul(Big(10) ** Big(decimals))
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
  const cumulative = Big(Number(cumulativeReleased) || 0).div(Big(10) ** Big(decimals))

  let totalReleased
  let currentReleased

  if (version === ContractVersion.V1) {
    totalReleased = Big(Number(data) || 0).div(Big(10) ** Big(decimals))
    currentReleased = totalReleased.minus(cumulative)
  } else {
    currentReleased = Big(Number(data) || 0).div(Big(10) ** Big(decimals))
    totalReleased = Big(Number(cumulativeReleased) || 0)
      .div(Big(10) ** Big(decimals))
      .add(currentReleased)
  }

  return {
    topic: Topic.RELEASE,
    data: {
      amount: currentReleased.toNumber(),
      acum: totalReleased.toNumber(),
      timestamp,
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

export async function release(from, contract, provider) {
  const signer = await provider.getSigner()
  if (contract.version === ContractVersion.V1) {
    return await new Contract(contract.address, vestingAbi, signer).release()
  }

  const ethContract = new Contract(contract.address, periodicTokenVestingAbi, signer)
  const releasableAmount = await ethContract.getReleasable()

  return await ethContract.release(from, releasableAmount)
}

export async function changeBeneficiary(contract, provider) {
  const signer = await provider.getSigner()
  const { version, address } = contract

  return version === ContractVersion.V1
    ? new Contract(contract.address, vestingAbi, signer).changeBeneficiary(address)
    : new Contract(contract.address, periodicTokenVestingAbi, signer).setBeneficiary(address)
}
