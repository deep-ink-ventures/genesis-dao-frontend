import type { ProposalDetail } from '@/stores/genesisStore';

const ProposalCard = (props: { p: ProposalDetail }) => {
  return (
    <div className='h-[193px] rounded-[8px] border-[0.3px] border-neutral-focus p-4'>
      <div className='flex flex-col gap-y-3'>
        <div className='flex justify-between'>
          <div>
            {props.p.proposalName}
            <p>{props.p.proposalId}</p>
          </div>
          <div>{props.p.status}</div>
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
