import { BN } from '@polkadot/util';
import cn from 'classnames';
import Image from 'next/image';
import { useMemo } from 'react';
import ReactHtmlParser from 'react-html-parser';

import { DAO_UNITS } from '@/config';
import useGenesisStore from '@/stores/genesisStore';
import arrowUp from '@/svg/arrow-up.svg';
import memberSign from '@/svg/memberSign.svg';
import type { ProposalDetail } from '@/types/proposal';
import { getProposalEndTime } from '@/utils';

import { TransactionBadge } from './TransactionBadge';

interface TransactionAccordionProps {
  proposal: ProposalDetail;
  collapsed?: boolean;
  onClick?: () => void;
}

const TransactionAccordion = ({
  proposal,
  collapsed,
  onClick,
}: TransactionAccordionProps) => {
  const [currentDao, currentBlockNumber] = useGenesisStore((s) => [
    s.currentDao,
    s.currentBlockNumber,
  ]);

  const dhmMemo = useMemo(() => {
    return proposal?.birthBlock &&
      currentBlockNumber &&
      currentDao?.proposalDuration
      ? getProposalEndTime(
          currentBlockNumber,
          proposal.birthBlock,
          currentDao?.proposalDuration
        )
      : { d: 0, h: 0, m: 0 };
  }, [proposal, currentBlockNumber, currentDao?.proposalDuration]);

  return (
    <div
      className={cn('rounded-lg border-[0.02rem] border-neutral-focus p-4', {
        'space-y-3': !collapsed,
      })}>
      <div
        className={cn(
          'flex w-full cursor-pointer items-center gap-2 border-neutral-focus',
          {
            'border-b-[0.02rem] pb-2': !collapsed,
          }
        )}
        onClick={onClick}>
        {false && (
          <div className='badge-error badge h-[0.5rem] w-[0.5rem] p-0' />
        )}
        {false && <div>Faulty Proposal</div>}
        <div className='grow'>{proposal.proposalName}</div>
        <div className='flex text-[0.8rem]'>
          <Image src={memberSign} alt='Member Sign' height={16} width={16} />
          {` ${proposal?.inFavor.div(new BN(DAO_UNITS)).toString()} `}
          out of
          {` ${proposal?.voterCount.div(new BN(DAO_UNITS)).toString()}`}
        </div>
        <div className='mr-4 flex items-center gap-2 text-xs'>
          Ends in
          <div className='flex items-center gap-2'>
            <div className='h-6 bg-base-card px-2 leading-6'>{dhmMemo.d}d</div>:
            <div className='h-6 bg-base-card px-2 leading-6'>{dhmMemo.h}h</div>:
            <div className='h-6 bg-base-card px-2 leading-6'>{dhmMemo.m}m</div>
          </div>
        </div>
        <TransactionBadge status={proposal.status as string} />
        <div className='p-2'>
          <Image
            src={arrowUp}
            className={cn(
              'duration-5000 transform transition-all ease-in-out',
              {
                'rotate-180': collapsed,
              }
            )}
            alt='Collapse'
            height={16}
            width={16}
          />
        </div>
      </div>
      <div
        className={cn(
          'opacity-1 duration-5000 flex gap-4 transition-all ease-in-out',
          {
            '!h-[0px] min-h-[0px] overflow-hidden opacity-0': collapsed,
            'min-h-[100px]': !collapsed,
          }
        )}>
        <div className='flex-1 space-y-2'>
          <div>{proposal.metadata?.title}</div>
          <div>{ReactHtmlParser(proposal.metadata?.description ?? '')}</div>
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
            <div className='font-bold'>This Proposal is Faulty?</div>
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
