import { BN } from '@polkadot/util';
import { useMemo } from 'react';

import Tooltip from '@/components/Tooltip';
import { DAO_UNITS } from '@/config';
import useGenesisStore from '@/stores/genesisStore';
import type { ProposalDetail } from '@/types/proposal';
import { getProposalEndTime, uiTokens } from '@/utils';

import { TransactionBadge } from './TransactionBadge';

const ProposalCard = (props: { p: ProposalDetail }) => {
  const currentDao = useGenesisStore((s) => s.currentDao);
  const currentBlockNumber = useGenesisStore((s) => s.currentBlockNumber);

  const dhmMemo = useMemo(() => {
    return props.p?.birthBlock &&
      currentBlockNumber &&
      currentDao?.proposalDuration
      ? getProposalEndTime(
          currentBlockNumber,
          props.p?.birthBlock,
          currentDao?.proposalDuration
        )
      : { d: 0, h: 0, m: 0 };
  }, [props.p, currentBlockNumber, currentDao?.proposalDuration]);

  const inFavorPercentageMemo = useMemo(() => {
    const inFavorVotes = props.p?.inFavor || new BN(0);
    const againstVotes = props.p?.against || new BN(0);
    const totalVotes = inFavorVotes.add(againstVotes);
    const inFavorPercentage = inFavorVotes.isZero()
      ? new BN(0)
      : inFavorVotes.mul(new BN(100)).div(totalVotes);
    return inFavorPercentage.toString();
  }, [props.p]);

  const againstPercentageMemo = useMemo(() => {
    const inFavorVotes = props.p?.inFavor || new BN(0);
    const againstVotes = props.p?.against || new BN(0);
    const totalVotes = inFavorVotes.add(againstVotes);
    const againstPercentage = againstVotes.isZero()
      ? new BN(0)
      : againstVotes.mul(new BN(100)).div(totalVotes);
    return againstPercentage.toString();
  }, [props.p]);

  const proposalIsRunning = useMemo(() => {
    if (
      (props.p?.birthBlock || 0) + (currentDao?.proposalDuration || 14400) >
      (currentBlockNumber || 0)
    ) {
      return true;
    }
    return false;
  }, [props.p, currentDao, currentBlockNumber]);

  return (
    <div className='min-h-[180px] rounded-[8px] border-[0.3px] border-neutral-focus p-4 hover:outline hover:cursor-pointer'>
      <div className='flex flex-col gap-y-3'>
        <div className='mb-3 flex justify-between'>
          <div>
            <p className='mb-1 text-sm'>Proposal ID: {props.p.proposalId}</p>
            <h3 className='text-2xl'>{props.p.proposalName}</h3>
          </div>
          <div className='flex'>
            {proposalIsRunning ? (
              <div className='mr-4 flex gap-2'>
                Ends in
                <div className='flex gap-2'>
                  <div className='h-6 bg-base-card px-2'>{dhmMemo.d}d</div>:
                  <div className='h-6 bg-base-card px-2'>{dhmMemo.h}h</div>:
                  <div className='h-6 bg-base-card px-2'>{dhmMemo.m}m</div>
                </div>
              </div>
            ) : (
              <div className='mr-4 flex flex-col'>
                <p>Ended </p>
              </div>
            )}
            {props.p?.status != null && (
              <TransactionBadge status={props.p?.status} />
            )}
          </div>
        </div>
        <div className='flex justify-between'>
          <div className='flex w-[100%] flex-col pr-6'>
            <div className='relative mb-2 flex w-full justify-between'>
              <div
                className={`h-7 bg-[#403945]`}
                style={{ width: `${inFavorPercentageMemo.toString()}%` }}>
                <div className='absolute p-1 text-sm'>
                  In Favor (
                  {props.p?.inFavor
                    ? props.p.inFavor.div(new BN(DAO_UNITS)).toString()
                    : new BN(0).toString()}
                  )
                </div>
              </div>
              <p className='ml-1'>{`${inFavorPercentageMemo.toString()}% `}</p>
            </div>
            <div className='relative mb-2 flex w-full justify-between'>
              <div
                className={`h-7 bg-[#403945]`}
                style={{ width: `${againstPercentageMemo.toString()}%` }}>
                <div className='absolute p-1 text-sm'>
                  <p className=''>
                    Against (
                    {props.p?.against
                      ? props.p.against.div(new BN(DAO_UNITS)).toString()
                      : new BN(0).toString()}
                    )
                  </p>
                </div>
              </div>
              <p className='ml-1'>{`${againstPercentageMemo.toString()}%`}</p>
            </div>
          </div>
          <div>
            {props.p.status === 'Active' && proposalIsRunning ? (
              <Tooltip
                placement='top'
                content={`Please note, that creating a proposal requires a one-time deposit of ${uiTokens(
                  currentDao?.proposalTokenDeposit,
                  'none',
                  currentDao?.daoId
                )} ${
                  currentDao?.proposalTokenDeposit?.gt(new BN(1))
                    ? 'tokens'
                    : 'token'
                }`}>
                <button className='btn btn-primary w-28'>Vote</button>
              </Tooltip>
            ) : null}
            {props.p.status === 'Active' && !proposalIsRunning ? (
              <button className='btn btn-primary w-28'>Finalize</button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalCard;
