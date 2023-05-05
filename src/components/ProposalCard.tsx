import { BN, formatBalance } from '@polkadot/util';

import type { ProposalDetail } from '@/stores/genesisStore';

export const statusColors = {
  Active: 'bg-neutral text-base-100',
  Counting: 'bg-secondary text-base-100',
  Accepted: 'bg-accent text-base-100',
  Rejected: 'bg-error',
  Faulty: 'bg-error',
  undefined: 'bg-neutral text-base-100',
};

const ProposalCard = (props: { p: ProposalDetail }) => {
  formatBalance.setDefaults({ decimals: 0, unit: props.p.daoId });
  const inFavorVotes = props.p.inFavor;
  const againstVotes = props.p.against;
  const totalVotes = inFavorVotes.add(againstVotes);
  const inFavorPercentage = inFavorVotes.isZero()
    ? 0
    : inFavorVotes.mul(new BN(100)).div(totalVotes);
  const againstPercentage = againstVotes.isZero()
    ? 0
    : againstVotes.mul(new BN(100)).div(totalVotes);

  return (
    <div
      className='min-h-[193px] rounded-[8px] border-[0.3px] border-neutral-focus p-4 hover:cursor-pointer hover:outline'
      onClick={() => {
        // router.push(`/dao/${props.p.daoId}/proposal/${props.p.proposalId}`) fixme
      }}>
      <div className='flex flex-col gap-y-3'>
        <div className='flex justify-between'>
          <div>
            <p className='text-sm'>{props.p.proposalId}</p>
            <h3 className='text-lg'>{props.p.proposalName}</h3>
          </div>
          <div
            className={`rounded-lg ${
              !props.p.status ? '' : statusColors[`${props.p.status}`]
            } h-7 rounded-3xl py-1 px-3 text-center text-sm`}>
            {props.p.status}
          </div>
        </div>
        <div className='max-w-[680px] truncate break-words text-sm'>
          {props.p.description}
        </div>
        <div className='flex justify-between'>
          <div className='flex w-[100%] flex-col pr-6'>
            <div className='relative mb-2 flex w-full justify-between'>
              <div
                className={`h-7 bg-[#403945]`}
                style={{ width: `${inFavorPercentage.toString()}%` }}>
                <div className='absolute p-1 text-sm'>
                  In Favor (
                  {formatBalance(inFavorVotes, {
                    withZero: false,
                    forceUnit: `${props.p.daoId}`,
                  })}
                  )
                </div>
              </div>
              <p>{`${inFavorPercentage.toString()}% `}</p>
            </div>
            <div className='relative mb-2 flex w-full justify-between'>
              <div
                className={`h-7 bg-[#403945]`}
                style={{ width: `${againstPercentage.toString()}%` }}>
                <div className='absolute p-1 text-sm'>
                  <p className=''>
                    Against (
                    {formatBalance(againstVotes, {
                      withZero: false,
                      forceUnit: `${props.p.daoId}`,
                    })}
                    )
                  </p>
                </div>
              </div>
              <p>{`${againstPercentage.toString()}%`}</p>
            </div>
          </div>
          <div>
            {props.p.status === 'Active' ? (
              <button className='btn-primary btn w-28'>Vote</button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalCard;
