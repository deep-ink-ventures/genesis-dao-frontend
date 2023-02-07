import type { ReactNode } from 'react';

import Meta from '@/components/Meta';
import WalletConnect from '@/components/WalletConnect';

import TopNavBar from '../components/TopNavBar';

interface IMainProps {
  title: string;
  description: string;
  canonical?: string;
  siteName?: string;
  children: ReactNode;
}

/**
 *
 * @param meta
 * @param children
 * @returns
 */
const MainLayout = (props: IMainProps) => (
  <div className='w-full px-1'>
    <Meta
      title={props.title}
      description={props.description}
      canonical={props.canonical ? props.canonical : undefined}
      siteName={props.siteName ? props.siteName : undefined}
    />
    <div className='mx-auto max-w-screen-2xl pt-2'>
      <div>
        <div className='flex justify-between'>
          <div className='py-2 pl-3 text-center'>
            {/* Genesis Dao logo */}
            <div className='text-3xl font-bold'>Genesis DAO</div>
          </div>
          <div className='pt-4 pb-2'>
            <TopNavBar />
          </div>
          <div className='mr-5 py-2'>
            <WalletConnect />
          </div>
        </div>
        <div className='m-3 min-h-screen rounded-2xl border-2 border-slate-800 p-3'>
          {props.children}
        </div>
      </div>
    </div>
  </div>
);

export default MainLayout;
