export const faq = [
  [
    'What is a DAO?',
    "A DAO, or Decentralized Autonomous Organization, is an organization represented by rules encoded as a computer program that is transparent, controlled by the organization members and not influenced by a central government. A DAO's financial transactions and rules are maintained on a blockchain.",
  ],
  [
    'What is Genesis DAO?',
    'Genesis DAO is an innovative software application designed to enable users to create and manage their own Decentralized Autonomous Organizations (DAOs) easily and efficiently. This tool provides a user-friendly interface and features that guide you through the entire process of creating, deploying, and managing a DAO.',
  ],
  [
    'What is Polkadot?',
    "Polkadot is a multi-chain platform that allows diverse blockchains to transfer any type of data or asset, not just tokens, thereby making a wide range of blockchains interoperable with each other. Polkadot's relay chain allows for the processing of multiple transactions and operations across different chains in parallel, providing scalability solutions to networks.",
  ],
  [
    'What are Polkadot Parachains?',
    'Parachains are individual blockchains that run in parallel within the Polkadot ecosystem. They are diverse and can have unique characteristics allowing them to process a high number of transactions in a scalable manner.',
  ],
  [
    'What kind of technical knowledge do I need to use Genesis DAO?',
    'Genesis DAO is designed to be user-friendly, even for individuals with minimal technical knowledge. However, a basic understanding of blockchain technology, DAOs, and Polkadot would be beneficial.',
  ],
  [
    'Can I customize the rules of my DAO?',
    'Absolutely. Genesis DAO offers flexibility and control over the rules and parameters of your DAO. You can customize the governance structure, voting mechanisms, member roles, and more. Note that some of these features are still in development.',
  ],
  [
    'Is there a cost to use Genesis DAO?',
    'Genesis DAO is free to use. However, users are required to pay for transaction costs and stake with the native currency to participate in governance.',
  ],
  [
    'Is Genesis DAO live yet?',
    "No, Genesis DAO is currently in its testnet phase. We're actively testing and refining its features before it goes live.",
  ],
];

const Faqs = () => {
  return (
    <>
      {faq.map((pair) => {
        return (
          <div className='mb-5' key={pair[0]}>
            <div className='mb-1 text-xl font-semibold'>{pair[0]}</div>
            <div>{pair[1]}</div>
          </div>
        );
      })}
    </>
  );
};

export default Faqs;
