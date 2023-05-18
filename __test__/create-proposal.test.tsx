import { act, render, screen } from '@testing-library/react';

import CreateAProposal from '../src/pages/dao/[daoId]/create-proposal';
// eslint-disable-next-line
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: { daoId: 'DAO' },
      asPath: '',
    };
  },
}));

const useRouter = jest.spyOn(require('next/router'), 'useRouter');

useRouter.mockImplementationOnce(() => ({ query: { daoId: 'DAO' } }));

describe('Proposals', () => {
  test('renders Proposals', async () => {
    // eslint-disable-next-line
    await act(async () => render(<CreateAProposal />));

    const el = screen.getAllByText(/Back/);
    expect(el[0]).toBeInTheDocument();
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});
