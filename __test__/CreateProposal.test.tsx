import { act, render, screen } from '@testing-library/react';

import CreateProposal from '../src/components/CreateProposal';
import type { DaoDetail } from '../src/stores/genesisStore';

// eslint-disable-next-line
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    json: jest.fn().mockResolvedValue({}),
  } as any);
});

const daoDetail: DaoDetail = {
  daoId: 'MANGO',
  daoName: 'MANGO',
  daoOwnerAddress: '{N/A}',
  daoCreatorAddress: '{N/A}',
  setupComplete: false,
  proposalDuration: null,
  proposalTokenDeposit: 0,
  minimumMajority: null,
  daoAssetId: null,
  metadataUrl: null,
  metadataHash: null,
  descriptionShort: null,
  descriptionLong: null,
  email: null,
  images: {
    contentType: null,
    small: null,
    medium: null,
    large: null,
  },
};

describe('CreateProposal', () => {
  test('renders CreateProposal', async () => {
    // eslint-disable-next-line
    await act(async () => render(<CreateProposal dao={daoDetail} handleChangePage={() => {}} />));

    const el = screen.getAllByText(/MANGO/);
    expect(el[0]).toBeInTheDocument();
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});
