import { render, screen } from '@testing-library/react';

import Index from '../src/pages/index';
// eslint-disable-next-line
jest.mock('next/router', () => require('next-router-mock'));

describe('Index page', () => {
  describe('Render method', () => {
    it('should have Genesis Dao text', () => {
      render(<Index />);
      const texts = screen.getAllByText(/Genesis DAO/);
      expect(texts[0]).toBeDefined();
    });
  });
});
