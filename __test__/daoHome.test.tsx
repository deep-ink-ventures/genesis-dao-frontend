import { act, render, screen } from '@testing-library/react';

import DaoHome from '../src/pages/dao/[daoId]/oldIndex';
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

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    json: jest.fn().mockResolvedValue({}),
  } as unknown as any);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Index page', () => {
  describe('Render method', () => {
    it('should have Genesis Dao text', async () => {
      // eslint-disable-next-line
      await act(async () => render(<DaoHome />));

      const texts = screen.getAllByText(/Genesis DAO/);
      expect(texts[0]).toBeDefined();
    });
  });
});
