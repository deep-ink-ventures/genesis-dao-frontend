import { act, render, screen } from '@testing-library/react';

import Index from '../src/pages/index';
// eslint-disable-next-line
jest.mock('next/router', () => require('next-router-mock'));

jest.mock('../src/components/CreateDaoModal');
jest.mock('../src/components/ExploreDaos');

describe('Index page', () => {
  describe('Render method', () => {
    it('should have Genesis Dao text', () => {
      render(<Index />);
      const texts = screen.getAllByText(/Genesis DAO/);
      expect(texts[0]).toBeDefined();
    });
  });
});
