import { render, screen } from '@testing-library/react';

import DestroyDao from '@/components/DestroyDao';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('DestoryDao', () => {
  test('renders DestoryDao', () => {
    render(<DestroyDao daoId='1' assetId={1} />);
    expect(screen.getByText('Destroy DAO')).toBeInTheDocument();
  });
});
