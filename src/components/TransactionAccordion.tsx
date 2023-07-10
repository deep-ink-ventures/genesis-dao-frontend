import cn from 'classnames';
import Image from 'next/image';
import { useState } from 'react';

import arrowUp from '@/svg/arrow-up.svg';
import memberSign from '@/svg/memberSign.svg';

import { TransactionBadge } from './TransactionBadge';

const TransactionAccordion = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div
      className={cn('rounded-lg border-[0.02rem] border-neutral-focus p-4', {
        'space-y-3': !isCollapsed,
      })}>
      <div
        className={cn(
          'flex w-full cursor-pointer items-center gap-2 border-neutral-focus',
          {
            'border-b-[0.02rem] pb-2': !isCollapsed,
          }
        )}
        onClick={() => setIsCollapsed(!isCollapsed)}>
        <div className='badge-error badge h-[0.5rem] w-[0.5rem] p-0' />
        <div>Faulty Proposal</div>
        <div className='grow'>TITLE_HERE</div>
        <div className='flex text-[0.8rem]'>
          <Image src={memberSign} alt='Member Sign' height={16} width={16} />2
          out of 3
        </div>
        <div className='mr-4 flex items-center gap-2 text-xs'>
          Ends in
          <div className='flex items-center gap-2'>
            <div className='h-6 bg-base-card px-2 leading-6'>{0}d</div>:
            <div className='h-6 bg-base-card px-2 leading-6'>{0}h</div>:
            <div className='h-6 bg-base-card px-2 leading-6'>{0}m</div>
          </div>
        </div>
        <TransactionBadge status='Active' />
        <div className='p-2'>
          <Image
            src={arrowUp}
            className={cn('transform transition-all ease-in-out', {
              'rotate-180': isCollapsed,
            })}
            alt='Collapse'
            height={16}
            width={16}
          />
        </div>
      </div>
      <div
        className={cn(
          'flex min-h-[100px] gap-4 transition-all duration-300 ease-in-out',
          {
            '!h-[0px] min-h-[0px] overflow-hidden': isCollapsed,
          }
        )}>
        <div className='flex-1 space-y-2'>
          <div>PROPOSAL_TITLE</div>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.Ut enim
            ad minim veniam, quis nostrud exercitation ullamco...
          </div>
        </div>
        <div className='h-[inherit] border-r-[0.02rem] border-neutral-focus' />
        <div className='flex-1 space-y-4'>
          <div>
            <div className='text-sm text-neutral opacity-75'>Reporter</div>
            <div className='text-neutral'>ADMIN_MEMBER_NAME</div>
          </div>
          <div>
            <div className='text-sm text-neutral opacity-75'>
              Report Category
            </div>
            <div className='text-neutral'>Others - See Description</div>
          </div>
          <div className='w-full border-b-[0.02rem] border-neutral-focus' />
          <div className='space-y-2'>
            <div className='font-bold'>This Proposal is Fauly?</div>
            <div className='flex gap-2'>
              <button className='btn flex-1 bg-transparent text-neutral'>
                Yes
              </button>
              <button className='btn flex-1 bg-transparent text-neutral'>
                No
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionAccordion;
