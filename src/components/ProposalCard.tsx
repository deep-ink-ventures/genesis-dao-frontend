import type { ProposalDetail } from '@/stores/genesisStore';

const statusColors = {
  Active: 'bg-neutral text-base-100',
  Counting: 'bg-secondary text-base-100',
  Accepted: 'bg-accent text-base-100',
  Rejected: 'bg-error',
  Faulty: 'bg-error',
};

const ProposalCard = (props: { p: ProposalDetail }) => {
  return (
    <div className='h-[193px] rounded-[8px] border-[0.3px] border-neutral-focus p-4'>
      <div className='flex flex-col gap-y-3'>
        <div className='flex justify-between'>
          <div>
            <p className='text-sm'>{props.p.proposalId}</p>
            <h3 className='text-lg font-medium'>{props.p.proposalName}</h3>
          </div>
          <div
            className={`rounded-lg ${
              statusColors[`${props.p.status}`]
            } h-7 rounded-3xl py-1 px-3 text-center text-sm`}>
            {props.p.status}
          </div>
        </div>
        <div className='max-w-[680px] truncate break-words'>
          {props.p.description}
        </div>
        <div>
          <div>{props.p.inFavor.toString()}</div>
          <div>{props.p.against.toString()}</div>
        </div>
      </div>
    </div>
  );
};

export default ProposalCard;
