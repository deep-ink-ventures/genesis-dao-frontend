import { BN } from '@polkadot/util';
import cn from 'classnames';
import Image from 'next/image';
import ReactHtmlParser from 'react-html-parser';

import { DAO_UNITS } from '@/config';
import arrowUp from '@/svg/arrow-up.svg';
import memberSign from '@/svg/memberSign.svg';
import type { MultiSigTransaction } from '@/types/multiSigTransaction';

import { TransactionBadge } from './TransactionBadge';

interface TransactionAccordionProps {
  multisigTransaction: MultiSigTransaction;
  collapsed?: boolean;
  onClick?: () => void;
}

const MultisigTransactionAccordion = ({
  multisigTransaction,
  collapsed,
  onClick,
}: TransactionAccordionProps) => {
  const { proposal } = multisigTransaction.correspondingModels || {};

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
        <div className='grow'>{multisigTransaction.daoId}</div>
        <div className='flex text-[0.8rem]'>
          <Image src={memberSign} alt='Member Sign' height={16} width={16} />
          {` ${proposal?.votes?.pro?.div(new BN(DAO_UNITS)).toString()} `}
          out of
          {` ${proposal?.votes?.total?.div(new BN(DAO_UNITS)).toString()}`}
        </div>
        <div className='mr-4 flex items-center gap-2 text-xs'>
          {multisigTransaction?.createdAt}
        </div>
        <TransactionBadge status={multisigTransaction.status as string} />
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
          <div>{proposal?.metadata?.title}</div>
          <div>{ReactHtmlParser(proposal?.metadata?.description ?? '')}</div>
        </div>
        <div className='h-[inherit] border-r-[0.02rem] border-neutral-focus' />
        <div className='flex-1 space-y-4'>
          <div>
            <div className='text-sm text-neutral opacity-75'>Signers</div>
            <div className='text-neutral'>
              {multisigTransaction?.approvers?.map((approver, index) => (
                <div key={`${index}-${approver}`}>{approver}</div>
              ))}
            </div>
          </div>
          <div className='w-full border-b-[0.02rem] border-neutral-focus' />
          <div className='space-y-2'>
            <div className='flex gap-2'>
              <button className='btn flex-1 bg-transparent text-neutral'>
                Approve
              </button>
              <button className='btn flex-1 bg-transparent text-neutral'>
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultisigTransactionAccordion;
