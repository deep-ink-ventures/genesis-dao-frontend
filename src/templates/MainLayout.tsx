import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import Meta from '@/components/Meta';
import WalletConnect from '@/components/WalletConnect';
import logo from '@/svg/logo.svg';

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
      canonical={props.canonical ? props.canonical : ''}
      siteName={props.siteName ? props.siteName : 'Genesis DAO'}
    />
    <div className='mx-auto max-w-screen-2xl'>
      <div>
        <div className='header'></div>
        <div className='flex justify-between px-6'>
          <div className='flex justify-center align-middle'>
            <div className='flex items-center justify-center align-middle'>
              <Link href='/'>
                <Image
                  src={logo}
                  width={32}
                  height={32}
                  alt='GenesisDAO logo'
                />
              </Link>
              <h1 className='m-auto pl-2 text-[24px]'>
                <Link href='/'>Genesis DAO</Link>
              </h1>
            </div>
          </div>
          <div className='py-2'>
            <WalletConnect />
          </div>
        </div>
        <div className='m-2 min-h-screen rounded-2xl border-2 border-slate-800 p-4'>
          {props.children}
        </div>
      </div>
    </div>
    <div
      className={`absolute top-[-15px] left-[15%] z-[-100] h-[60%] w-[80%] bg-[url('../../public/images/background-texture.png')] mix-blend-screen`}></div>
    <div className='blur0'></div>
    <div className='blur1'></div>
    <div className='blur2'></div>
  </div>
);

export default MainLayout;
