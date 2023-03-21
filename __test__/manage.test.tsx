import { render, screen } from '@testing-library/react';

import Manage from '../src/pages/manage';
// eslint-disable-next-line
jest.mock('next/router', () => require('next-router-mock'));

describe('Explore page', () => {
  describe('Render method', () => {
    it('should have Genesis Dao text', () => {
      render(<Manage />);

      const texts = screen.getAllByText(/Genesis DAO/);
      expect(texts[0]).toBeDefined();
    });
  });
});
