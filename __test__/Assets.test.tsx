/* eslint-disable testing-library/render-result-naming-convention */
/* eslint-disable testing-library/prefer-screen-queries */
import {
  fireEvent,
  queryByAttribute,
  render,
  screen,
} from '@testing-library/react';

import Assets from '@/components/Assets';

jest.mock('@/components/AssetsTable');

// eslint-disable-next-line
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    json: jest.fn().mockResolvedValue({}),
  } as any);
});

const getById = queryByAttribute.bind(null, 'id');

describe('Assets', () => {
  test('renders Assets', () => {
    render(<Assets />);

    const title = screen.getAllByText(/My Assets/);
    expect(title[0]).toBeInTheDocument();
  });

  test('updates the searchTerm when the input value changes', () => {
    const { getByPlaceholderText } = render(<Assets />);
    const inputElement = getByPlaceholderText(
      'Search Assets'
    ) as HTMLInputElement;

    expect(inputElement).toBeInTheDocument();

    fireEvent.change(inputElement, { target: { value: 'Test' } });

    expect(inputElement.value).toBe('Test');
  });

  test('shows the pagination component', () => {
    const viewAssets = render(<Assets />);
    const paginationElement = getById(viewAssets.container, 'pagination');

    expect(paginationElement).toBeInTheDocument();
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});
