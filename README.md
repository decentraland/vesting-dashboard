<img src="https://decentraland.org/images/decentraland.png" alt="Logo" width="128"/>

# Vesting Dashboard

Decentraland's [Vesting Dashboard](https://vesting.decentraland.org)

This web UI works with any MANA, DAI, USDC or USDT Vesting Contract

### Desktop

<img width="1440" alt="desktop view" src="https://user-images.githubusercontent.com/45410089/160152325-856b43a6-0792-4b8d-b090-356c1b1f8757.png">

### Mobile

<img width="1440" alt="mobile view" src="https://user-images.githubusercontent.com/45410089/160152465-b1a2ab64-99dc-4c0e-8103-edb1161e5ba5.png">

## Running the project

First copy the `.env.example` file to `.env` using:

```bash
cp .env.example .env
```

and, in `.env`, change any variable you need.

Then:

```bash
npm install && npm start
```

You will have to provide the vesting contract's address in the url, like:

```
http://localhost:3000/#/0x92f08...6fb12
```

## Deployment

Every commit to the `master` branch will deploy automatically to the dev (https://vesting.decentraland.zone) and staging https://vesting.decentraland.today) environments.

To deploy to prod, you will need to first create a [Release](https://github.com/decentraland/vesting-dashboard/releases) and then run the rollout manually from [this action](https://github.com/decentraland/vesting-dashboard/actions/workflows/set-rollouts-manual.yaml). Input the version of the newly created release, select the `org` env and kick it 🚀
