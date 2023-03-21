import { render, screen } from '@testing-library/react';

import Create from '../src/pages/start';
// eslint-disable-next-line
jest.mock('next/router', () => require('next-router-mock'));

describe('Create page', () => {
  describe('Render method', () => {
    it('should have Genesis Dao text', () => {
      render(<Create />);

      const texts = screen.getAllByText(/Genesis DAO/);
      expect(texts[0]).toBeDefined();
    });
  });
});
