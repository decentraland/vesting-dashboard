import { getAddress } from 'modules/contract/selectors'
import { getAddress as getFrom } from 'modules/ethereum/selectors'
import Web3 from 'web3'
import manaAbi from '../abi/mana.json'
import daiAbi from "../abi/dai.json";
import usdtAbi from "../abi/usdt.json";
import usdcAbi from "../abi/usdc.json";
import vestingAbi from "../abi/vesting.json";
import { TokenAddress, Topic } from "./constants";
import Big from "big.js";

let vesting, tokenContracts, eth;
export default class API {
  store = null;
  web3 = null;
  localWallet = null;

  setStore(store) {
    this.store = store;
  }

  getWeb3() {
    if (this.web3 === null) {
      this.web3 = new Web3(
        new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`)
      );
    }

    return this.web3;
  }

  async logIn() {
    const ethereum = window.ethereum;
    await ethereum.enable();
    const accounts = await ethereum.request({ method: "eth_accounts" });
    this.localWallet = accounts[0];

    this.web3 = new Web3(ethereum);
  }

  async connect() {
    try {
      await this.logIn();
    } catch {
      new console.error("Metamask not found");
    }
    const state = this.store.getState();
    const address = getAddress(state);

    eth = this.getWeb3().eth;
    vesting = new eth.Contract(vestingAbi, address);
    tokenContracts = {
      [TokenAddress.MANA]: new eth.Contract(manaAbi, TokenAddress.MANA),
      [TokenAddress.DAI]: new eth.Contract(daiAbi, TokenAddress.DAI),
      [TokenAddress.USDT]: new eth.Contract(usdtAbi, TokenAddress.USDT),
      [TokenAddress.USDC]: new eth.Contract(usdcAbi, TokenAddress.USDC),
    };
    return this.localWallet;
  }

  async fetchContract() {
    const state = this.store.getState();
    const address = getAddress(state);

    const tokenContractAddress = (await vesting.methods.token().call()).toLowerCase();

    if (!(tokenContractAddress in tokenContracts)) {
      throw new Error("Token not supported");
    }

    const decimals = await tokenContracts[tokenContractAddress].methods.decimals().call();

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
      releaseLogs,
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
      this.getReleaseLogs(decimals),
    ]);

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
      releaseLogs,
    };

    return contract;
  }

  async getReleaseLogs(decimals) {
    const state = this.store.getState();
    const address = getAddress(state);

    const web3Logs = await eth.getPastLogs({
      address: address,
      topic: Topic.RELEASE,
      fromBlock: 0,
      toBlock: "latest",
    });

    const blocks = await Promise.all(web3Logs.map((log) => eth.getBlock(log.blockNumber)));

    const logs = [];
    let cumulativeData = Big(0);
    for (const idx in web3Logs) {
      const data = Big(Number(web3Logs[idx].data) || 0).div(10 ** decimals);
      const currentData = data.minus(cumulativeData);
      cumulativeData = cumulativeData.add(currentData);
      logs.push({
        amount: currentData.toNumber(),
        acum: data.toNumber(),
        timestamp: blocks[idx].timestamp,
      });
    }

    return logs.slice(1);
  }

  release() {
    const state = this.store.getState();
    const from = getFrom(state);
    return vesting.methods.release().send({ from });
  }

  changeBeneficiary(address) {
    const state = this.store.getState();
    const from = getFrom(state);
    return vesting.methods.changeBeneficiary(address).send({ from });
  }

  async fetchTicker(ticker = "decentraland") {
    try {
      const resp = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ticker}&vs_currencies=usd`, {
        mode: "cors",
      });
      const json = await resp.json();
      const { usd } = json[ticker];
      return usd;
    } catch (e) {
      return 0;
    }
  }

  async getNetwork() {
    const chainId = await eth.getChainId();
    return { name: chainId === 1 ? "mainnet" : "unknown", chainId };
  }
}
