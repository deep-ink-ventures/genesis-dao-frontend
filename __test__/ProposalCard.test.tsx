import { BN } from '@polkadot/util';
import { render, screen } from '@testing-library/react';

import type { ProposalDetail } from '@/stores/genesisStore';
import { ProposalStatus } from '@/stores/genesisStore';

import ProposalCard from '../src/components/ProposalCard';

describe('ProposalCard', () => {
  test('render with the correct proposal id and proposal name', () => {
    const proposal: ProposalDetail = {
      proposalId: '1',
      daoId: 'MANGO',
      creator: '5Dc4froJzAxNrpxC1JMvM27GMMjk6fN5cxiQDV6zdbeHvBn6',
      birthBlock: 2000,
      metadataUrl: 'fake url',
      metadataHash: 'fake hash',
      status: ProposalStatus.Active,
      inFavor: new BN(1000),
      against: new BN(300),
      proposalName: 'This is a proposal',
      description: 'proposal description',
      link: 'https://google.com',
    };

    render(<ProposalCard p={proposal} />);

    const proposalName = screen.getByText(/This is a proposal/);
    expect(proposalName).toBeInTheDocument();

    const proposalId = screen.getByText(/1/);
    expect(proposalId).toBeInTheDocument();
  });
});
