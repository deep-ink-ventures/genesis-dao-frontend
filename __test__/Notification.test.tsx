import { render, screen } from '@testing-library/react';

import NotificationToast from '@/components/NotificationToast';
import { TxnResponse } from '@/types/response';

describe('Notification Toast', () => {
  it('should render the text Successful', () => {
    render(
      <NotificationToast
        type={TxnResponse.Success}
        title='Successful Transaction'
        message='Your Transaction went through'
        timestamp={1676559857}
      />
    );
    // eslint-disable-next-line
    screen.findAllByText('Successful').then((text) => {
      expect(text[0]).toBeInTheDocument();
      return text;
    });
  });
});
