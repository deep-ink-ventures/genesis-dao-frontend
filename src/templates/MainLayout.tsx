import Link from 'next/link';
import type { ReactNode } from 'react';

import WalletConnect from '@/components/WalletConnect';

interface IMainProps {
  meta: ReactNode;
  children: ReactNode;
}

const MainLayout = (props: IMainProps) => (
  <div className='w-full border-2 px-1'>
    {props.meta}
    <div className='mx-auto max-w-screen-2xl border-2'>
      <div className='border-2 border-gray-300'>
        <div className='pt-16 pb-8 text-center'>
          <div className='text-3xl font-bold'>Genesis DAO</div>
        </div>
        <div className='flex justify-between'>
          <div className='ml-5'>
            <ul className='flex flex-wrap text-xl'>
              <li className='mr-6'>
                <Link href='/' className='border-none hover:text-gray-900'>
                  Home
                </Link>
              </li>
            </ul>
          </div>
          <div className='mr-5'>
            <WalletConnect />
          </div>
        </div>
        <div className='m-3 min-h-screen border-2'>{props.children}</div>
      </div>
    </div>
  </div>
);

export default MainLayout;
