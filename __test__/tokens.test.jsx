import { render, screen } from '@testing-library/react';

import Tokens from '@/pages/dao/[daoId]/tokens.tsx';

// eslint-disable-next-line
jest.mock('next/router', () => require('next-router-mock'));

describe('Dao Tokens page', () => {
  it('should render the button', async () => {
    render(<Tokens text='Connect' />);
    await screen.findAllByRole('button').then((button) => {
      expect(button[0]).toBeInTheDocument();
    });
  });
});
