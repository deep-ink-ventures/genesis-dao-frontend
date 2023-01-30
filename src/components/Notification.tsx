import useGenesisStore from '@/stores/genesisStore';


import NotificationToast from './NotificationToast';

// fixme currently we don't delete notifications
const TransactionNotification = () => {
  const txnNotifications = useGenesisStore((s) => s.txnNotifications);

  return (
    <div className='flex justify-center'>
      {txnNotifications.map((noti) => {
        // we can use timestamp as stable keys here because they don't change once stored
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
