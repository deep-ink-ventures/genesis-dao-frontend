import { useEffect, useState } from 'react';

import { TxnResponse } from '../stores/genesisStore';
import { truncateMiddle } from '../utils';

interface ToastProps {
  type: TxnResponse;
  title: string;
  message: string;
  txnHash?: string;
  timestamp: number;
}

const ToastIcon = ({ type }: { type: TxnResponse }) => {
  if (type === TxnResponse.Error) {
    return (
      <div className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200'>
        <svg
          aria-hidden='true'
          className='h-5 w-5'
          fill='currentColor'
          viewBox='0 0 20 20'
          xmlns='http://www.w3.org/2000/svg'>
          <path
            fillRule='evenodd'
            d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
            clipRule='evenodd'></path>
        </svg>
        <span className='sr-only'>Error icon</span>
      </div>
    );
  }
  if (type === TxnResponse.Warning) {
    return (
      <div className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200'>
        <svg
          aria-hidden='true'
          className='h-5 w-5'
          fill='currentColor'
          viewBox='0 0 20 20'
          xmlns='http://www.w3.org/2000/svg'>
          <path
            fillRule='evenodd'
            d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
            clipRule='evenodd'></path>
        </svg>
        <span className='sr-only'>Warning icon</span>
      </div>
    );
  }
  return (
    <div className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200'>
      <svg
        aria-hidden='true'
        className='h-5 w-5'
        fill='currentColor'
        viewBox='0 0 20 20'
        xmlns='http://www.w3.org/2000/svg'>
        <path
          fillRule='evenodd'
          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
          clipRule='evenodd'></path>
      </svg>
      <span className='sr-only'>Check icon</span>
    </div>
  );
};

const NotificationToast = (props: ToastProps) => {
  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(false);
  };

  const makeExplorerLink = (hash: string) => {
    const prefix =
      'https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9944#/explorer/query/';
    return prefix + hash;
  };

  // make noti disappear after x seconds
  useEffect(() => {
    const timeId = setTimeout(() => {
      setShow(!show);
    }, 8000);

    return () => {
      clearTimeout(timeId);
    };
  }, []);

  if (!show) {
    return null;
  }

  return (
    <div className='absolute top-[12px] z-40'>
      <div
        id='toast-success'
        className='mb-3 flex w-full max-w-xs items-center rounded-lg bg-white p-4 text-gray-500 shadow dark:bg-gray-800 dark:text-gray-400 '
        role='alert'>
        <ToastIcon type={props.type} />
        <div className='flex-col flex-wrap '>
          <h4 className='font-bol ml-3'>{props.title}</h4>
          <p className='ml-3 text-xs'>{props.message}</p>
          {/* fixme convert this into a component */}
          {props.txnHash ? (
            <p className='ml-3 break-words text-xs text-blue-500 decoration-solid'>
              <a
                href={makeExplorerLink(props.txnHash)}
                target='_blank'
                rel='noreferrer'>{`Txn Hash: ${truncateMiddle(
                props.txnHash,
                5,
                5
              )}`}</a>
            </p>
          ) : null}
        </div>
        <button
          type='button'
          className='-m-1.5 ml-auto inline-flex h-8 w-8 rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-white'
          data-dismiss-target='#toast-success'
          aria-label='Close'
          onClick={handleClose}>
          <span className='sr-only'>Close</span>
          <svg
            aria-hidden='true'
            className='h-5 w-5'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'>
            <path
              fillRule='evenodd'
              d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
              clipRule='evenodd'></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;
