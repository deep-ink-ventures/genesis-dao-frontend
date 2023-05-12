import { render, screen, act } from '@testing-library/react';
import LogoForm from '../src/components/LogoForm.tsx';

// eslint-disable-next-line
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    json: jest.fn().mockResolvedValue({}),
  });
});

describe('LogoForm', () => {
  test('renders Logo Form', async () => {
    await act(async () => render(<LogoForm />));

    const el = screen.getAllByText(/Logo/);
    expect(el[0]).toBeInTheDocument();

    const ele = screen.getAllByText(/Description/);
    expect(ele[0]).toBeInTheDocument();
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});
