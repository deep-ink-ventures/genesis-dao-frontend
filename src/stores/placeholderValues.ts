const placeholderValues = {
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
      name: 'Eric',
      walletAddress: '5Dc4froJzAxNrpxC1JMvM27GMMjk6fN5cxiQDV6zdbeHvBn6',
      tokens: 20000,
    },
    {
      name: 'Tommy',
      walletAddress: '1pvJNQTckq2rWJDVbxSsE8Eggh8B7JSwg2QQrEQHJjUnPRp',
      tokens: 20000,
    },
    {
      name: 'Dasha',
      walletAddress: '14zvCP3KRFUijMwy9SvZxUzZVMGdHovXeYVzA9PojS7FTaHT',
      tokens: 20000,
    },
  ],
  treasuryTokens: 500000,
};

export default placeholderValues;
