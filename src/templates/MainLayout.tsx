import type { ReactNode } from 'react';

import WalletConnect from '@/components/WalletConnect';

import TopNavBar from '../components/TopNavBar';

interface IMainProps {
  meta: ReactNode;
  children: ReactNode;
}

const MainLayout = (props: IMainProps) => (
  <div className='w-full px-1'>
    {props.meta}
    <div className='mx-auto max-w-screen-2xl pt-2'>
      <div className='border-1 '>
        <div className='flex justify-between'>
          <div className='py-2 pl-3 text-center'>
            <div className='text-3xl font-bold'>Genesis DAO</div>
          </div>
          <div className='pt-4 pb-2'>
            <TopNavBar />
          </div>
          <div className='mr-5 py-2'>
            <WalletConnect />
          </div>
        </div>
        <div className='m-3 min-h-screen border-2'>{props.children}</div>
      </div>
    </div>
  </div>
);

export default MainLayout;
