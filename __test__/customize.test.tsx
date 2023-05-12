import { render, screen } from '@testing-library/react';

import Customize from '@/pages/dao/[daoId]/customize';

// eslint-disable-next-line
jest.mock('next/router', () => require('next-router-mock'));

describe('Dao Customization page', () => {
  it('should render the button', async () => {
    render(<Customize />);
    await screen.findAllByRole('button').then((button) => {
      expect(button[0]).toBeInTheDocument();
    });
  });
});
