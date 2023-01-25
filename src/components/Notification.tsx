import { useEffect } from 'react';

import useGenesisStore from '@/stores/genesisStore';

import NotificationToast from './NotificationToast';

const TransactionNotification = () => {
  const txnNotifications = useGenesisStore((s) => s.txnNotifications);
  const showNotification = useGenesisStore((s) => s.showNotification);
  const updateShowNotification = useGenesisStore(
    (s) => s.updateShowNotification
  );

  useEffect(() => {
    if (txnNotifications.length > 1 && !showNotification) {
      updateShowNotification(true);
      console.log('useeffect. noti show?', showNotification);
      setTimeout(() => {
        updateShowNotification(false);
      }, 2000);
    }
  });

  return (
    <div className='absolute'>
      {txnNotifications.map((noti) => {
        // we can use timestamp as stable keys here because they don't change
        return (
          <NotificationToast
            key={noti.timestamp}
            type={noti.type}
            title={noti.title}
            message={noti.message}
            timestamp={noti.timestamp}
            txnHash={noti.txnHash}
          />
        );
      })}
    </div>
  );
};

export default TransactionNotification;
