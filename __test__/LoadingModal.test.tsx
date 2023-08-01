import { render } from '@testing-library/react';

import LoadingModal from '@/components/LoadingModal';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('LoadingModal', () => {
  test('renders FAQs', () => {
    expect(render(<LoadingModal />)).not.toBeNull();
  });
});
