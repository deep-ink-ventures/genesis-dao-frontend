import { act, render, screen } from '@testing-library/react';

import Proposal from '../src/pages/dao/[daoId]/proposal/[propId]/index';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: { daoId: 'DAO', propId: '1' },
      asPath: '',
    };
  },
}));

const useRouter = jest.spyOn(require('next/router'), 'useRouter');

useRouter.mockImplementationOnce(() => ({
  query: { daoId: 'DAO', propId: '1' },
}));

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    json: jest.fn().mockResolvedValue({}),
  } as any);
});

describe('Proposal Page', () => {
  describe('Render method', () => {
    it('should have Genesis Dao text', async () => {
      // eslint-disable-next-line
      await act(async () => render(<Proposal />));

      const texts = screen.getAllByText(/Genesis DAO/);
      expect(texts[0]).toBeDefined();
    });

    it('should render the button', async () => {
      // eslint-disable-next-line
      await act(async () => render(<Proposal />));
      await screen.findAllByRole('button').then((button) => {
        expect(button[0]).toBeInTheDocument();
      });
    });
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});
