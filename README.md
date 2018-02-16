![](https://raw.githubusercontent.com/decentraland/web/gh-pages/img/decentraland.ico)

# Vesting Dashboard

[Decentraland](https://decentraland.org)'s MANA Token Vesting Dashboard

This dashboard should work with any vesting contract based on [OpenZeppelin's TokenVesting](https://github.com/OpenZeppelin/zeppelin-solidity/blob/master/contracts/token/ERC20/TokenVesting.sol) for any ERC20 token just by [tweaking this file](https://github.com/decentraland/vesting-dashboard/blob/master/src/modules/api.js).

<img width="1251" alt="screen shot 2018-02-16 at 3 17 34 pm" src="https://user-images.githubusercontent.com/2781777/36322604-b1ef1926-132c-11e8-997e-b93d4f4851df.png">


## Running the project

* `npm install`

* `npm start`

You will need a browser with [Metamask](http://metamask.io/) in order to access the page, and you will have to provide the vesting contract's address in the url, like:

```
http://localhost:3000/#/0x92f08...6fb12
```

If you want to see a vesting contract deployed to ropsten you will have to change the addresses of `REACT_APP_MANA_TOKEN_CONTRACT_ADDRESS` and `REACT_APP_TERRAFORM_RESERVE_CONTRACT_ADDRESS` in the `.env` file to the [ropsten addresses](https://contracts.decentraland.org/addresses.json).
