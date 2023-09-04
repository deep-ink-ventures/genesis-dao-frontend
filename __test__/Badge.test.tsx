/* eslint-disable testing-library/render-result-naming-convention */
/* eslint-disable testing-library/prefer-screen-queries */
import { queryByAttribute, render } from '@testing-library/react';

import Badge from '@/components/Badge';

const getById = queryByAttribute.bind(null, 'id');

describe('Badge', () => {
  test('renders text inside the badge', () => {
    const { getByText } = render(<Badge>Text</Badge>);
    expect(getByText('Text')).toBeInTheDocument();
  });

  test('renders the Badge with "none" variant classnames correctly', () => {
    const viewBadge = render(<Badge variant='none'>None</Badge>);
    const badgeElement = getById(viewBadge.container, 'badge');
    expect(badgeElement).toHaveClass('dark:bg-white dark:text-black');
  });

  test('renders the Badge with "danger" variant classnames correctly', () => {
    const viewBadge = render(<Badge variant='danger'>Danger</Badge>);
    const badgeElement = getById(viewBadge.container, 'badge');
    expect(badgeElement).toHaveClass('dark:bg-red-800 dark:text-white');
  });

  test('renders the Badge with "warning" variant classnames correctly', () => {
    const viewBadge = render(<Badge variant='warning'>Warning</Badge>);
    const badgeElement = getById(viewBadge.container, 'badge');
    expect(badgeElement).toHaveClass('dark:bg-secondary dark:text-black');
  });

  test('renders the Badge with "success" variant classnames correctly', () => {
    const viewBadge = render(<Badge variant='success'>Success</Badge>);
    const badgeElement = getById(viewBadge.container, 'badge');
    expect(badgeElement).toHaveClass('dark:bg-green-300 dark:text-black');
  });
});
