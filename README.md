# GenesisDAO Frontend

## About

This is the frontend UI for GenesisDAO. Users can use this interface to create DAOs, vote on proposals, and govern the DAO via multisignature transactions.  


## Status

:hammer_and_wrench: This repo is still in the early development stage and please use it at your own risk. 

Our design guide and mockups are [here](./design/)

## Tech and code structure

![Polkadot](https://img.shields.io/badge/polkadot-E6007A?style=for-the-badge&logo=polkadot&logoColor=white) ![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) 

This application is built with React and Next.js. We use Tailwind for CSS and [Zustand](https://github.com/pmndrs/zustand) for state management.


Zustand stores folder is [here](./src/stores/). Query actions are also in the [`useGenesisStore`](./src/stores/genesisStore.ts) file. 

Most of the transaction actions are in the [`useGenesisDao`](./src/hooks/useGenesisDao.ts) hook

## Getting Started

Adjust the environment variables to your need or go with the defaults:

```shell
cp .env.example .env
```

> The frontend defaults to the service and node of the genesis dao test environment.

### Docker setup

We are using docker compose.

```shell
docker compose build
docker compose up
```

### Building from source
1. Install node packages

```
yarn install
```

2. Start dev server 
```
yarn dev
```

3. Now you can open http://localhost:3000 on your browser to see the application.

If you need to change the node endpoint, you can go to the [config](./src/config) folder

## Usage

- Please have one these wallet extensions installed on your browser: Talisman, Subwallet, or Polkadotjs extension. You can find them [here](https://wiki.polkadot.network/docs/wallets)

- You will need some GenesisDAO native tokens to do transactions. For now, you can use the [Polkadotjs UI](https://polkadot.js.org/apps). Go to the `Accounts` tab and pick one of the development accounts to transfer tokens to your own account. As of now, you will need 10 native tokens to create a DAO. 


## Before commit

Please run this script to test, format, and lint code. 

```
yarn pre-commit
```


Please use this script to commit and run tests:

```
yarn commit
```


This repo uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#specification) specifications


## License
[APACHE 2.0 License](https://github.com/deep-ink-ventures/genesis-dao-frontend/blob/main/LICENSE)
