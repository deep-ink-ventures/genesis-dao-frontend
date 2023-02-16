import { render, screen } from '@testing-library/react';

import Create from '../src/pages/create';

describe('Create page', () => {
  describe('Render method', () => {
    it('should have Genesis Dao text', () => {
      render(<Create />);

      const texts = screen.getAllByText(/Genesis DAO/);
      expect(texts[0]).toBeDefined();
    });
  });
});
