import { BN } from '@polkadot/util';

import type { ProposalDetail } from './genesisStore';
import { ProposalStatus } from './genesisStore';

export const fakeDao = {
  daoId: 'MYDAO',
  daoName: 'My Cool DAO',
  email: 'mydaoemail@gmail.com',
  daoLogo: null,
  shortOverview: `This is the coolest DAO on earth. You can beat it. This DAO is located in NYC the best city on earth. Out goal is to create the best DAO ever. `,
  longDescription: `ChatGPT said: "A DAO (decentralized autonomous organization) is a blockchain-based organization that operates using smart contracts and decentralized governance mechanisms. These organizations are run by code and decision-making is done through a voting process by token holders. The rules and governance of a DAO are transparent and immutable, making it more trustworthy and efficient than traditional centralized organizations. DAOs can be used for a wide range of purposes, from managing funds to creating digital marketplaces, and they have the potential to revolutionize the way we think about organization and management." `,
  proposalTokensCost: 100,
  approvalThreshold: 0.1,
  votingDays: 2,
  councilMembers: [
    {
      name: 'Eric',
      walletAddress: '5Dc4froJzAxNrpxC1JMvM27GMMjk6fN5cxiQDV6zdbeHvBn6',
    },
    {
      name: 'Tommy',
      walletAddress: '1pvJNQTckq2rWJDVbxSsE8Eggh8B7JSwg2QQrEQHJjUnPRp',
    },
    {
      name: 'Dasha',
      walletAddress: '14zvCP3KRFUijMwy9SvZxUzZVMGdHovXeYVzA9PojS7FTaHT',
    },
  ],
  councilThreshold: 2,
  tokensToIssue: 1000000,
  tokensRecipients: [
    {
      percentage: 0.02,
      walletAddress: '5Dc4froJzAxNrpxC1JMvM27GMMjk6fN5cxiQDV6zdbeHvBn6',
      tokens: 20000,
    },
    {
      percentage: 0.02,
      walletAddress: '1pvJNQTckq2rWJDVbxSsE8Eggh8B7JSwg2QQrEQHJjUnPRp',
      tokens: 20000,
    },
    {
      percentage: 0.02,
      walletAddress: '14zvCP3KRFUijMwy9SvZxUzZVMGdHovXeYVzA9PojS7FTaHT',
      tokens: 20000,
    },
  ],
  treasuryTokens: 500000,
};

export const fakeProposals: ProposalDetail[] = [
  {
    proposalId: 'PROP1',
    daoId: 'ORANGE',
    creator: '5Dc4froJzAxNrpxC1JMvM27GMMjk6fN5cxiQDV6zdbeHvBn6',
    birthBlock: 20500,
    meta: 'fake metadata link here',
    metaHash: 'fake hash here',
    status: ProposalStatus.Active,
    inFavor: new BN(5000),
    against: new BN(1200),
    proposalName: 'Deploy Uniswap V3 on zkSync',
    description: `He ordered his regular breakfast. Two eggs sunnyside up, hash browns, and two strips of bacon. He continued to look at the menu wondering if this would be theould be added to the order before demuring and saying that would be all. It was the same exact meal that he had ordered every day for the past two years.`,
    link: 'https://yahoo.com',
  },
  {
    proposalId: 'PROP2',
    daoId: 'ORANGE',
    creator: '5GpGweMfmUe8rV5ScXJgfhEAVU3Aom4yVF2YH9pscNQGzZgw',
    birthBlock: 15000,
    meta: 'fake metadata link here',
    metaHash: 'fake hash here',
    status: ProposalStatus.Rejected,
    inFavor: new BN(1000),
    against: new BN(7000),
    proposalName:
      'Should Uniswap governance contribute funding to the Nomic Foundation?',
    description: `I'm heading back to Colorado tomorrow after being down in Santa Barbara over the weekend for the festival there. I will be making October plans once there and will try to arrange so I'm back here for the birthday if possible. I'll let you know as soon as I know the doctor's appointment schedule and my flight plans.`,
    link: 'https://google.com',
  },
  {
    proposalId: 'PROP101',
    daoId: 'ORANGE',
    creator: '5Dc4froJzAxNrpxC1JMvM27GMMjk6fN5cxiQDV6zdbeHvBn6',
    birthBlock: 20500,
    meta: 'fake metadata link here',
    metaHash: 'fake hash here',
    status: ProposalStatus.Accepted,
    inFavor: new BN(5000),
    against: new BN(4000),
    proposalName: 'Deploy Uniswap V3 on ETH',
    description: `blahbalhbalhbalghefefefrwsrgilhjuqerglhuiqergiluhqelrgiuhqleirughlqeirughlqieurghlqieurhglqieurhglqiuergh`,
    link: 'https://yahoo.com',
  },
];
