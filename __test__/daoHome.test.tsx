import { render, screen } from '@testing-library/react';

import DaoHome from '../src/pages/dao/[daoId]/index';

// The easiest solution to mock `next/router`: https://github.com/vercel/next.js/issues/7479
// The mock has been moved to `__mocks__` folder to avoid duplication

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const useRouter = jest.spyOn(require('next/router'), 'useRouter');

useRouter.mockImplementationOnce(() => ({ query: { daoId: 'DAO' } }));

describe('Index page', () => {
  describe('Render method', () => {
    it('should have Genesis Dao text', () => {
      render(<DaoHome />);

      const texts = screen.getAllByText(/Genesis DAO/);
      expect(texts[0]).toBeDefined();
    });
  });
});
