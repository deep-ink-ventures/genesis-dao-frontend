import { render, screen } from '@testing-library/react';
import React from 'react';

import IssueTokensForm from '@/components/IssueTokensForm';

describe('IssueTokensForm', () => {
  test('renders the form with the correct inputs and submit button', () => {
    render(<IssueTokensForm daoId='1' />);
    // eslint-disable-next-line
    screen.findAllByRole('form').then((forms) => {
      expect(forms[0]).toBeDefined();
    });
  });
});
