import { render, screen } from '@testing-library/react';

import Manage from '../src/pages/manage';

// The easiest solution to mock `next/router`: https://github.com/vercel/next.js/issues/7479
// The mock has been moved to `__mocks__` folder to avoid duplication

describe('Explore page', () => {
  describe('Render method', () => {
    it('should have Genesis Dao text', () => {
      render(<Manage />);

      const texts = screen.getAllByText(/Genesis DAO/);
      expect(texts[0]).toBeDefined();
    });
  });
});
