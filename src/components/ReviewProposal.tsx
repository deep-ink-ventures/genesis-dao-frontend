import Link from 'next/link';

import useGenesisDao from '@/hooks/useGenesisDao';
import useGenesisStore from '@/stores/genesisStore';

const ReviewProposal = (props: { daoId: string }) => {
  const { createAProposal } = useGenesisDao();
  const proposalValues = useGenesisStore((s) => s.proposalValues);
  const txnProcessing = useGenesisStore((s) => s.txnProcessing);
  const updateTxnProcessing = useGenesisStore((s) => s.updateTxnProcessing);

  const submitProposal = async () => {
    updateTxnProcessing(true);
    if (proposalValues) {
      createAProposal(props.daoId, proposalValues);
    }
  };

  return (
    <div className='flex flex-col gap-y-6 px-6'>
      <div className='flex justify-center'>
        <progress
          className='progress progress-primary h-[10px] w-[400px]'
          value='80'
          max='100'
        />
      </div>
      <div className='text-center'>
        <h2 className='text-primary'>Review Proposal</h2>
        <p className=''>
          {`NOTE: Submitting a proposal at this steps requires you to sign and approve 3 times.`}
        </p>
      </div>
      <div className='flex flex-col gap-y-4 rounded-xl bg-base-card px-4 py-8'>
        <div className='flex flex-col'>
          <p className='text-neutral-focus'>Proposal Name</p>
          <p>{proposalValues?.title}</p>
        </div>
        <div className='flex flex-col'>
          <p className='text-neutral-focus'>Description</p>
          <p>{proposalValues?.description}</p>
        </div>
        <div className='flex flex-col'>
          <p className='text-neutral-focus'>Discussion Link</p>
          <p>{proposalValues?.url}</p>
        </div>
      </div>
      <div className='flex justify-end'>
        <Link href={`/dao/${encodeURIComponent(props.daoId)}/create-proposal/`}>
          <button className={`btn mr-4 w-48 ${txnProcessing ? 'loading' : ''}`}>
            Back
          </button>
        </Link>
        <button
          className={`btn-primary btn mr-4 w-48 ${
            txnProcessing ? 'loading' : ''
          }`}
          onClick={submitProposal}>{`${
          txnProcessing ? 'Processing' : 'Submit'
        }`}</button>
      </div>
    </div>
  );
  // fix me: need to add majority vote and add
};

export default ReviewProposal;
