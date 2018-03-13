![](https://raw.githubusercontent.com/decentraland/web/gh-pages/img/decentraland.ico)

# Vesting Dashboard

[Decentraland](https://decentraland.org)'s [MANA Token Vesting Dashboard](https://vesting.decentraland.org)

This web UI works with any vesting contract based on [OpenZeppelin's TokenVesting](https://github.com/OpenZeppelin/zeppelin-solidity/blob/master/contracts/token/ERC20/TokenVesting.sol) for any ERC20 token just by [tweaking this file](https://github.com/decentraland/vesting-dashboard/blob/master/src/modules/api.js).

<img width="1440" alt="screen shot 2018-03-12 at 11 32 42 pm" src="https://user-images.githubusercontent.com/2781777/37319433-c9a285c4-264d-11e8-9e15-135f3a1440fb.png">


## Running the project

* `npm install`

* `npm start`

You will need a browser with [MetaMask](http://metamask.io/) in order to access the page, and you will have to provide the vesting contract's address in the url, like:

```
http://localhost:3000/#/0x92f08...6fb12
```

If you want to see a vesting contract deployed to ropsten you will have to change the addresses of `REACT_APP_MANA_TOKEN_CONTRACT_ADDRESS` and `REACT_APP_TERRAFORM_RESERVE_CONTRACT_ADDRESS` in the `.env` file to the [ropsten addresses](https://contracts.decentraland.org/addresses.json).
