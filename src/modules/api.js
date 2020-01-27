import { getAddress } from "modules/contract/selectors";
import Web3 from "web3";
import manaAbi from "../abi/mana.json";
import vestingAbi from "../abi/vesting.json";

let mana, vesting;

export default class API {
  store = null;

  setStore(store) {
    this.store = store;
  }

  async connect() {
    const state = this.store.getState();
    const address = getAddress(state);

    const localWallet = (await window.ethereum.enable())[0];
    const web3 = new Web3(window.web3);

    mana = new web3.eth.Contract(manaAbi, "0x0F5D2fB29fb7d3CFeE444a200298f468908cC942");
    vesting = new web3.eth.Contract(vestingAbi, address);

    return localWallet;
  }

  async fetchContract() {
    const state = this.store.getState();
    const address = getAddress(state);

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
      vesting.methods.start().call()
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
      start: parseInt(start, 10)
    };

    return contract;
  }

  release() {
    return vesting.methods.release().call();
  }

  changeBeneficiary(address) {
    return vesting.methods.changeBeneficiary(address).call();
  }

  async fetchTicker(ticker = "decentraland") {
    const resp = await fetch(`https://api.coinmarketcap.com/v1/ticker/${ticker}/`, { mode: "cors" });
    const json = await resp.json();
    return json[0];
  }

  async getNetwork() {
    await window.ethereum.enable();
    return window.web3;
  }
}
