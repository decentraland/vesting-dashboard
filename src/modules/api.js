import { getAddress } from 'modules/contract/selectors'
import { getAddress as getFrom } from 'modules/ethereum/selectors'
import Web3 from 'web3'
import manaAbi from '../abi/mana.json'
import daiAbi from "../abi/dai.json";
import usdtAbi from "../abi/usdt.json";
import vestingAbi from "../abi/vesting.json";

let vesting, tokenContracts;

export default class API {
  store = null;

  setStore(store) {
    this.store = store;
  }

  async connect() {
    const state = this.store.getState();
    const address = getAddress(state);

    const ethereum = window.ethereum;
    const accounts = await ethereum.request({ method: "eth_accounts" });
    const localWallet = accounts[0];

    const web3 = new Web3(ethereum);
    vesting = new web3.eth.Contract(vestingAbi, address);
    tokenContracts = {
      "0x0f5d2fb29fb7d3cfee444a200298f468908cc942": new web3.eth.Contract(manaAbi,"0x0f5d2fb29fb7d3cfee444a200298f468908cc942"),
      "0x6b175474e89094c44da98b954eedeac495271d0f": new web3.eth.Contract(daiAbi,"0x6b175474e89094c44da98b954eedeac495271d0f"),
      "0xdac17f958d2ee523a2206206994597c13d831ec7": new web3.eth.Contract(usdtAbi,"0xdac17f958d2ee523a2206206994597c13d831ec7"),
    };

    return localWallet;
  }

  async fetchContract() {
    const state = this.store.getState();
    const address = getAddress(state);

    const tokenContractAddress = (await vesting.methods.token().call()).toLowerCase();

    if (!(tokenContractAddress in tokenContracts)) {
      throw new Error("Token not supported");
    }

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
    ]);

    const contract = {
      symbol,
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
    const web3 = new Web3(window.ethereum);
    const chainId = await web3.eth.getChainId();
    return { name: chainId === 1 ? "mainnet" : "unknown", chainId };
  }
}
