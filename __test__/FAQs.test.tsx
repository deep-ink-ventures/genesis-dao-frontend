import { render, screen } from '@testing-library/react';

import FAQs, { faq } from '@/components/FAQs';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('FAQs', () => {
  test('renders FAQs', () => {
    render(<FAQs />);
    faq.forEach((item: any) =>
      expect(screen.getByText(item[0])).toBeInTheDocument()
    );
  });
});
