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

Every commit to the `master` branch deploys automatically to the development environment (https://vesting.decentraland.zone). Staging and production are promoted manually through the [CDN deploy workflow](https://github.com/decentraland/vesting-dashboard/actions/workflows/cdn-deploy.yaml).

To deploy to staging (https://vesting.decentraland.today), open **CDN deploy** → **Run workflow**, select environment `today`, enter a release version or the commit-build version from a successful deployment run, and set the rollout percentage (normally `100`).

To deploy to production (https://vesting.decentraland.org):

1. Publish a [Release](https://github.com/decentraland/vesting-dashboard/releases) that is not a prerelease.
2. Wait for its **CDN deploy** `release` job to finish successfully. This builds and uploads the release and deploys it to development.
3. Open **CDN deploy** → **Run workflow**, select environment `org`, enter the release version, and set the rollout percentage (normally `100`). Production requires a release version; commit builds are not accepted.

Only versions successfully uploaded through the CDN deploy workflow can be promoted. Versions published before the migration cannot be promoted or used as rollback targets through this workflow.
