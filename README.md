![](https://raw.githubusercontent.com/decentraland/web/gh-pages/img/decentraland.ico)

# Vesting Dashboard

[Decentraland](https://decentraland.org)'s MANA Token Vesting Dashboard

## Running the project

* `npm install`

* `npm start`

You will need a browser with [Metamask](http://metamask.io/) in order to access the page, and you will have to provide the vesting contract's address in the url, like:

```
http://localhost:3000/#/0x92f08...6fb12
```

If you want to see a vesting contract deployed to ropsten you will have to change the addresses of `REACT_APP_MANA_TOKEN_CONTRACT_ADDRESS` and `REACT_APP_TERRAFORM_RESERVE_CONTRACT_ADDRESS` in the `.env` file to the [ropsten addresses](https://contracts.decentraland.org/addresses.json)
