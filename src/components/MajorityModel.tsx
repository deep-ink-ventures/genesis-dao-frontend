import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import type { MajorityModelValues } from '@/stores/genesisStore';
import useGenesisStore from '@/stores/genesisStore';

const MajorityModel = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm<MajorityModelValues>();

  const updateCreateDaoSteps = useGenesisStore((s) => s.updateCreateDaoSteps);
  const [threshold, setThreshold] = useState(10);

  const handleBack = () => {
    updateCreateDaoSteps(1);
  };

  const handleNext = () => {
    updateCreateDaoSteps(3);
  };

  const handleThresholdChange = (event: any) => {
    setThreshold(event.target.value);
  };

  const onSubmit = (data: any) => {
    console.log(data);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      updateCreateDaoSteps(3);
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
                className='input-primary input pr-20'
                type='number'
                placeholder='0'
                {...register('proposalTokensCost', {
                  required: 'Required',
                  min: { value: 1, message: 'Minimum is 1' },
                })}
              />
              <div className='absolute top-3 left-[6.5em] opacity-70'>
                Tokens
              </div>
            </div>
          </div>
          <div className='min-w-full'>
            <p className='mb-1 ml-1'>
              Approval Threshold{' '}
              <span className='text-lg font-medium text-red-600'>*</span>
            </p>
            <p className='mb-1 ml-1 text-xs'>
              Minimum percentage of circulating token supply needed to validate
              a proposal
            </p>
            <div className='flex justify-between'>
              <div className='w-[78%]'>
                <div className='flex h-12 items-center justify-evenly rounded-[10px] border-[0.3px] border-neutral-focus bg-base-50'>
                  <p className='opacity-80'>{threshold}%</p>
                  <input
                    type='range'
                    className='range range-primary h-3 w-[75%]'
                    min={0}
                    max={100}
                    value={threshold}
                    onChange={handleThresholdChange}
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
              <div className='absolute top-3 left-[7.4em] opacity-70'>Days</div>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-4 flex w-full justify-end'>
        <button className='btn mr-3 w-48' onClick={handleBack}>
          Back
        </button>
        <button
          className='btn-primary btn w-48'
          type='submit'
          onClick={handleNext}>
          Next
        </button>
      </div>
    </form>
  );
};

export default MajorityModel;
