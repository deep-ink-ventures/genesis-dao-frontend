import Link from 'next/link';
import type { ReactNode } from 'react';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => (
  <div className='w-full px-1 text-gray-700 antialiased'>
    {props.meta}
    <div className='mx-auto max-w-screen-md'>
      <div className='border-b border-gray-300'>
        <div className='pt-16 pb-8'>
          <div className='text-3xl font-bold text-gray-900'>Genesis DAO</div>
        </div>
        <div>
          <ul className='flex flex-wrap text-xl'>
            <li className='mr-6'>
              <Link
                href='/'
                className='border-none text-gray-700 hover:text-gray-900'>
                Home
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export { Main };
