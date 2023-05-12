import { render, screen, act } from '@testing-library/react';
import MajorityModel from '../src/components/MajorityModel.tsx';

// eslint-disable-next-line
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: { daoId: 'DAO' },
      asPath: '',
    };
  },
}));

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    json: jest.fn().mockResolvedValue({}),
  });
});

describe('MajorityModel', () => {
  test('renders MajorityModel', async () => {
    // eslint-disable-next-line
    await act(async () => render(<MajorityModel daoId={'coolDAO'} />));

    const el = screen.getAllByText(/Majority/);
    expect(el[0]).toBeInTheDocument();

    const ele = screen.getAllByText(/proposal/);
    expect(ele[0]).toBeInTheDocument();
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});
