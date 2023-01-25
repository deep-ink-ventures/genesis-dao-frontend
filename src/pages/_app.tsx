import '../styles/global.css';

import type { AppProps } from 'next/app';

import NotificationToast from '@/components/NotificationToast';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <div>
      <Component {...pageProps} />
      <NotificationToast />
    </div>
  );
};

export default MyApp;
