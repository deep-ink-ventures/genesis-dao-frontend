import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import useGenesisStore from '@/stores/genesisStore';

const MajorityModel = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm();
  const updateCreateDaoSteps = useGenesisStore((s) => s.updateCreateDaoSteps);

  const handleBack = () => {
    updateCreateDaoSteps(1);
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
            <p className='mb-1 ml-1'>Proposal Token Cost</p>
            <p className='mb-1 ml-1 text-xs'>
              Number of tokens needed to create a proposal
            </p>
            <input
              className='input-primary input'
              type='number'
              placeholder='0'
              {...register('tokensCost', {
                required: 'Required',
                min: { value: 1, message: 'Minimum is 1' },
              })}
            />
          </div>
          <div className='min-w-full'>
            <p className='mb-1 ml-1'>Approval Threshold</p>
            <p className='mb-1 ml-1 text-xs'>
              Minimum percentage of circulating token supply needed to validate
              a proposal
            </p>
            <div className='flex justify-between'>
              <div className='relative w-[20%]'>
                <input
                  className='input-primary input'
                  type='number'
                  placeholder='0'
                  {...register('threshold', {
                    min: { value: 1, message: 'Minimum is 1%' },
                    max: { value: 70, message: 'Maximum is 70%' },
                    required: 'Required',
                  })}
                />
                <div className='absolute top-3 left-16 opacity-70'>%</div>
              </div>
              <div className='w-[78%]'>
                <div className='flex h-12 items-center justify-evenly rounded-[10px] border-[0.3px] border-neutral-focus bg-base-50'>
                  <p className='opacity-80'>0%</p>
                  <input
                    type='range'
                    className='range range-primary h-3 w-[75%]'
                    min={0}
                    max={100}></input>
                  <p className='opacity-80'>100%</p>
                </div>
              </div>
            </div>
          </div>
          <div className='min-w-full'>
            <p className='mb-1 ml-1'>Proposal Duration</p>
            <p className='mb-1 ml-1 text-xs'>
              Number of tokens needed to create a proposal
            </p>
            <input
              className='input-primary input'
              type='number'
              placeholder='0'
              {...register('votingDays', {
                required: 'Required',
                min: { value: 1, message: 'Minimum is 1' },
              })}
            />
          </div>
        </div>
      </div>
      <div className='mt-4 flex w-full justify-end'>
        <button className='btn mr-3 w-48' onClick={handleBack}>
          Back
        </button>
        <button className='btn-primary btn w-48' type='submit'>
          Next
        </button>
      </div>
    </form>
  );
};

export default MajorityModel;
