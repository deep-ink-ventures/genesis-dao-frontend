import { v4 as uuidv4 } from 'uuid';

import useGenesisStore from '@/stores/genesisStore';

import NotificationToast from './NotificationToast';

const TransactionNotification = () => {
  const txnNotifications = useGenesisStore((s) => s.txnNotifications);

  return (
    <div className='flex justify-center'>
      <div className='fixed top-[20px] z-[1000]'>
        {txnNotifications.map((noti) => {
          // we can use timestamp as stable keys here because they don't change once stored
          return (
            <NotificationToast
              key={uuidv4()}
              type={noti.type}
              title={noti.title}
              message={noti.message}
              timestamp={noti.timestamp}
              txnHash={noti.txnHash}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TransactionNotification;
