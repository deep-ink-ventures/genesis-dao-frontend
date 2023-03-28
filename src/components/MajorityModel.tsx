import { ErrorMessage } from '@hookform/error-message';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import useGenesisDao from '@/hooks/useGenesisDao';
import type { MajorityModelValues } from '@/stores/genesisStore';
import useGenesisStore from '@/stores/genesisStore';

const MajorityModel = (props: { daoId: string | null }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitSuccessful },
  } = useForm<MajorityModelValues>({
    defaultValues: {
      proposalTokensCost: 0,
      approvalThreshold: 10,
      votingDays: 1,
    },
  });

  const watchApprovalThreshold = watch('approvalThreshold');
  const { setGovernanceMajorityVote } = useGenesisDao();
  const updateCreateDaoSteps = useGenesisStore((s) => s.updateCreateDaoSteps);
  const txnProcessing = useGenesisStore((s) => s.txnProcessing);

  const handleNext = () => {
    updateCreateDaoSteps(2);
  };

  const onSubmit = (data: MajorityModelValues) => {
    if (!props.daoId) {
      return;
    }
    setGovernanceMajorityVote(
      props.daoId,
      data.votingDays * 14400,
      data.proposalTokensCost,
      data.approvalThreshold * 10
    );
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='min-w-full'>
      <div className='card flex h-[580px] w-full items-center justify-center hover:border-none hover:brightness-100'>
        <div className='mb-8 flex flex-col items-center gap-y-8 px-32'>
          <div className='text-center'>
            Majority Vote allows members to make decisions collectively. With a
            majority vote system, members can cast their votes on proposals, and
            the outcome is determined by the number of votes received.
          </div>
          <div className='min-w-full'>
            <p className='mb-1 ml-1'>
              Proposal Token Cost{' '}
              <span className='text-lg font-medium text-red-600'>*</span>
            </p>
            <p className='mb-1 ml-1 text-xs'>
              Number of tokens needed to create a proposal
            </p>
            <div className='relative w-[175px]'>
              <input
                className={` input pr-20 ${
                  errors.proposalTokensCost ? 'input-error' : 'input-primary'
                }`}
                type='number'
                placeholder='0'
                {...register('proposalTokensCost', {
                  required: 'Required',
                  min: { value: 1, message: 'Minimum is 1' },
                })}
              />
              <ErrorMessage
                errors={errors}
                name='proposalTokensCost'
                render={({ message }) => (
                  <p className='mt-1 ml-2 text-error'>{message}</p>
                )}
              />
              <div className='absolute top-3 left-[6.5em] opacity-70'>
                Tokens
              </div>
            </div>
          </div>
          <div className='min-w-full'>
            <p className='mb-1 ml-1'>
              Minimum Majority Threshold{' '}
              <span className='text-lg font-medium text-red-600'>*</span>
            </p>
            <p className='mb-1 ml-1 text-xs'>
              {`DAO proposals will pass only if (votes in favor - votes against) >= (minimum majority threshold * total token supply)`}
            </p>
            <div className='flex justify-between'>
              <div className='w-[78%]'>
                <div className='flex h-12 items-center justify-evenly rounded-[10px] border-[0.3px] border-neutral-focus bg-base-50'>
                  <p className='opacity-80'>{watchApprovalThreshold}%</p>
                  <input
                    type='range'
                    className='range range-primary h-3 w-[75%]'
                    min={0}
                    max={25}
                    value={watchApprovalThreshold}
                    {...register('approvalThreshold')}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='min-w-full'>
            <p className='mb-1 ml-1'>
              Proposal Duration{' '}
              <span className='text-lg font-medium text-red-600'>*</span>
            </p>
            <p className='mb-1 ml-1 text-xs'>
              Number of days the proposal will be up for voting.
            </p>
            <div className='relative flex w-[175px]'>
              <input
                className='input-primary input pr-16'
                type='number'
                placeholder='0'
                {...register('votingDays', {
                  required: 'Required',
                  min: { value: 1, message: 'Minimum is 1' },
                })}
              />
              <ErrorMessage
                errors={errors}
                name='votingDays'
                render={({ message }) => (
                  <p className='mt-1 ml-2 text-error'>{message}</p>
                )}
              />
              <div className='absolute top-3 left-[7.4em] opacity-70'>Days</div>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-4 flex w-full justify-end'>
        <button
          className={`btn-primary btn mr-3 w-48 ${
            txnProcessing ? 'loading' : null
          }`}
          type='submit'>
          Approve and Sign
        </button>
        <button
          className={`btn w-48 ${txnProcessing ? 'disabled' : null}`}
          type='button'
          onClick={handleNext}>
          Skip
        </button>
      </div>
    </form>
  );
};

export default MajorityModel;
