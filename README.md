<img src="https://decentraland.org/images/decentraland.png" alt="Logo" width="128"/>

# Vesting Dashboard

Decentraland's [Vesting Dashboard](https://vesting.decentraland.org)

This web UI works with any MANA, DAI, USDC or USDT Vesting Contract

### Desktop
<img width="1440" alt="desktop view" src="https://user-images.githubusercontent.com/45410089/157481195-0f07edc1-5e56-478d-bd03-53a0afb77765.png">

### Mobile
<img width="1440" alt="mobile view" src="https://user-images.githubusercontent.com/45410089/157279375-9ec9b920-30fe-42e1-b0e1-a64324ede161.png">

## Running the project

First rename the `.env.example` file to `.env` and add your [INFURA API key](https://infura.io/) in the variable `REACT_APP_INFURA_API_KEY`.

Then:

```bash
npm install && npm start
```

You will have to provide the vesting contract's address in the url, like:

```
http://localhost:3000/#/0x92f08...6fb12
```
