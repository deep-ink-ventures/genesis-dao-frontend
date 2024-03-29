import '../styles/global.css';

import type { AppProps } from 'next/app';

import TransactionNotification from '../components/Notification';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <div className='relative overflow-x-hidden'>
      <TransactionNotification />
      <Component {...pageProps} />
    </div>
  );
};

export default MyApp;
