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
    birthBlock: 41944,
    meta: 'fake metadata link here',
    metaHash: 'fake hash here',
    status: ProposalStatus.Active,
    inFavor: new BN(5000),
    against: new BN(1200),
    proposalName:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vestibulum tristique tortor, quis egestas turpis luctus id.',
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vestibulum tristique tortor, quis egestas turpis luctus id. Sed pharetra nulla diam. Morbi vel est eleifend tortor tincidunt consequat vitae in ligula. In rhoncus magna turpis, non fringilla ipsum commodo sit amet. In sollicitudin ultrices nisi. Nullam vel bibendum ipsum. Nulla volutpat sodales sem, at molestie orci convallis vitae. In elit mi, tincidunt vel rutrum et, varius ornare orci. In pharetra diam ac odio placerat aliquam. Pellentesque tincidunt molestie diam a pharetra. Mauris eleifend nisl vitae quam fringilla, ut egestas tellus suscipit. Praesent ultrices massa non risus auctor consequat. Aliquam auctor magna nec pulvinar congue. Cras ut finibus justo. Suspendisse quis nisl sit amet risus laoreet venenatis. Ut vel tincidunt augue.

    Maecenas sit amet elementum felis. Sed odio erat, sollicitudin et ligula sed, lacinia ornare ligula. Quisque non risus felis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Integer quis est luctus, bibendum mauris at, convallis turpis. Fusce cursus commodo sem, at dictum justo ultricies nec. Quisque nec nunc ac nisl mollis accumsan. Sed sit amet risus leo. Phasellus mollis tempus luctus. Quisque non mi cursus, molestie tortor a, porta ligula. Curabitur quis felis mauris. Integer faucibus libero in imperdiet feugiat. Integer vel rutrum justo. Nulla facilisi. Etiam at justo sed nisl pretium sagittis a a dui. Pellentesque mattis metus id congue tempus.
    
    Ut vel vehicula lorem. Nam lacinia ultricies mollis. Suspendisse dignissim justo quis ornare blandit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer sodales diam non sem sollicitudin consectetur. Suspendisse potenti. Duis eu sodales mi. Duis sollicitudin orci nisi, vulputate efficitur mauris venenatis at. Sed eget commodo neque. Quisque arcu est, facilisis eget aliquet non, interdum nec elit. Pellentesque sed arcu hendrerit, pulvinar quam nec, luctus orci. Morbi eget tincidunt augue. Nam lobortis lorem eget libero volutpat aliquam at sed ante. Nam nisl tortor, lobortis et euismod eget, convallis sed odio. Ut eget vestibulum magna, a cursus felis. Curabitur quis malesuada erat.
    
    Praesent auctor libero quam, ut porttitor arcu efficitur ut. Mauris faucibus nisi et facilisis porta. Quisque condimentum viverra libero nec vulputate. Donec ut imperdiet dui. Maecenas eu maximus risus. Proin commodo lobortis orci eget efficitur. Proin feugiat aliquet finibus.
    
    Quisque aliquam sem id metus pellentesque, in pulvinar leo ultricies. Sed ullamcorper enim vulputate felis consectetur, id consequat ligula feugiat. Sed porttitor commodo posuere. Curabitur id nisl hendrerit, fermentum nibh quis, semper nisi. Praesent finibus nulla non nunc blandit, gravida blandit mi mattis. Donec non pellentesque tellus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nulla augue, interdum ut pretium et, congue ac diam. Etiam non commodo augue. Proin ut mattis mauris. Etiam elementum sagittis neque.
    
    Donec sagittis dui ante, vel vulputate dolor egestas vitae. Nulla elit lacus, auctor a nibh vitae, porta semper nisi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla mattis posuere turpis eu molestie. Suspendisse eu hendrerit odio, ac lacinia lacus. Nunc leo libero, efficitur non nisl eu, auctor faucibus metus. Donec vel nunc porta, bibendum dui sed, malesuada enim. Ut semper nulla nec dignissim tincidunt. Suspendisse pretium urna non ipsum volutpat accumsan. Duis dapibus accumsan suscipit. Phasellus scelerisque nulla urna, eu iaculis urna vestibulum sit amet. Nam eu eros tempor urna ornare pulvinar eget ut elit.
    
    Duis magna turpis, malesuada sed varius nec, efficitur eu sem. Aliquam a enim nisl. Curabitur gravida eros et metus imperdiet, eu vehicula magna eleifend. In eu ante in dui iaculis varius. Quisque ut suscipit orci, et rhoncus metus. Nulla eget convallis justo. Proin arcu mi, feugiat quis gravida at, pretium non lacus. Vestibulum aliquam augue lobortis eros mollis tempus. Nunc ullamcorper libero est, quis lacinia sapien varius vel.
    
    Sed metus est, interdum sed tellus id, vehicula tincidunt dolor. Donec et nisi nisl. Donec dui risus, commodo eget molestie id, pellentesque id eros. Quisque blandit risus est, at hendrerit diam maximus nec. Integer non elit efficitur, ultricies justo a, ultrices nulla. Nulla eu tincidunt ipsum. Ut eget lectus libero. Etiam iaculis blandit feugiat. Proin semper lorem tortor, sed facilisis libero rhoncus cursus.
    
    Aliquam erat volutpat. Nunc convallis fringilla vulputate. Sed eu ullamcorper arcu, semper ullamcorper magna. Fusce at interdum mi. Proin at justo nec lorem euismod placerat. Proin mattis non metus eget lacinia. Cras a nisl sit amet metus aliquam vestibulum. Sed finibus nibh eget dolor commodo consectetur.
    
    Sed in dui sollicitudin, laoreet nibh eget, commodo tellus. Quisque sit amet velit ut leo tincidunt aliquet a et felis. Nam blandit, nibh sed porttitor euismod, erat lacus hendrerit lacus, quis rutrum tellus nunc at dolor. Suspendisse laoreet vehicula urna eget pharetra. In tortor lorem, dignissim sed rhoncus et, pretium accumsan velit. Pellentesque dapibus arcu at orci pharetra, at feugiat augue tempus. Fusce id eros nisi. Vivamus venenatis, urna aliquet bibendum volutpat, erat leo suscipit dolor, vel finibus dui felis eu neque. Vivamus enim nunc, venenatis non posuere quis, dignissim ut velit. Nullam laoreet tempus tortor. Morbi lacinia, velit sit amet bibendum porta, dolor dolor suscipit nibh, eget interdum lorem sapien quis lorem.`,
    link: 'https://yahoo.com/VgwjQRvkfeX0CtgItbJoTDa6Onb5EHbIHSf4YyjhbziX1Kb4HlNdQf6TrmHtKzXc5oxczoxQJ1RH9Co62ETdNxU0olxtAZnuyMY6',
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
    link: 'https://google.com/VgwjQRvkfeX0CtgItbJoTDa6Onb5EHbIHSf4YyjhbziX1Kb4HlNdQf6TrmHtKzXc5oxczoxQJ1RH9Co62ETdNxU0olxtAZnuyMY6',
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
    link: 'https://yahoo.com/VgwjQRvkfeX0CtgItbJoTDa6Onb5EHbIHSf4YyjhbziX1Kb4HlNdQf6TrmHtKzXc5oxczoxQJ1RH9Co62ETdNxU0olxtAZnuyMY6',
  },
];
