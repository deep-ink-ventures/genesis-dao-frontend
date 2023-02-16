import { render, screen } from '@testing-library/react';

import Explore from '../src/pages/explore';

describe('Explore page', () => {
  describe('Render method', () => {
    it('should have Genesis Dao text', () => {
      render(<Explore />);

      const texts = screen.getAllByText(/Genesis DAO/);
      expect(texts[0]).toBeDefined();
    });
  });
});
