import Image from 'next/image';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import useGenesisStore from '@/stores/genesisStore';
import plus from '@/svg/plus.svg';

const IssueTokens = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm();
  // const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
  const updateCreateDaoSteps = useGenesisStore((s) => s.updateCreateDaoSteps);

  const onSubmit = (data: any) => {
    console.log(data);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      updateCreateDaoSteps(3);
    }
  });

  const handleBack = () => {
    updateCreateDaoSteps(3);
  };

  const handleNext = () => {
    updateCreateDaoSteps(5);
  };

  return (
    <div className='flex flex-col items-center gap-y-5'>
      <div>
        <progress
          className='progress progress-primary h-[10px] w-[400px]'
          value='65'
          max='100'></progress>
      </div>
      <div>
        <h2 className='text-center text-primary'>Issue Tokens</h2>
      </div>
      <div className='px-24'>
        <p className='text-center'>
          A DAO can benefit from new levels of efficiency and control.
          Recipients can receive tokens as rewards for their contributions,
          while the treasury can use tokens for fundraising and other important
          initiatives.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
        <div className='card mb-5 flex h-[207px] w-full items-center justify-center border-none py-5 hover:brightness-100'>
          <div className='w-80'>
            <p>
              Number of Tokens To Issue<span className='text-error'> *</span>
            </p>
            <input
              type='number'
              placeholder='0'
              className='input-primary input text-center'
              {...register('tokensToIssue', {
                required: 'Required',
                min: { value: 1, message: 'Minimum is 1' },
              })}
            />
          </div>
        </div>
        <div className='card flex min-h-[350px] w-full flex-col items-center gap-y-6 border-none py-5 px-3 hover:brightness-100'>
          <div className='flex flex-col gap-y-4'>
            <div className='w-full text-center'>
              <h4 className='text-center'>Recipients</h4>
              <p className='text-sm'>Distribute Tokens To Wallet Addresses</p>
            </div>
            <div className='flex'>
              <div className='mr-3 flex flex-col justify-end pb-3'>1</div>
              <div className='flex'>
                <div className='w-[400px] flex-col'>
                  <p className='ml-1'>Wallet Address</p>
                  <input
                    type='text'
                    placeholder='Wallet Address'
                    className='input-primary input text-xs'
                    {...register('recipientAddress1', {
                      required: 'Required',
                      minLength: { value: 1, message: 'Minimum is 1' },
                      maxLength: { value: 30, message: 'Maximum is 30' },
                    })}
                  />
                </div>
                <div className='mx-3 flex flex-col'>
                  <p className='ml-1'>Number of Tokens</p>
                  <input
                    type='number'
                    placeholder='0'
                    className='input-primary input text-center'
                    {...register('recipientAddressTokens1', {
                      required: 'Required',
                      minLength: { value: 1, message: 'Minimum is 1' },
                      maxLength: { value: 30, message: 'Maximum is 30' },
                    })}
                  />
                </div>
                <div className='flex items-center justify-center pt-5'>0%</div>
              </div>
            </div>
          </div>
          <div>
            {/* fixme make this functional */}
            <button
              className='btn border-white bg-[#403945] text-white hover:bg-[#403945] hover:brightness-110'
              type='button'>
              <Image
                src={plus}
                width={17}
                height={17}
                alt='add one'
                className='mr-2'
              />
              Add a Recipient
            </button>
          </div>
          <hr className='my-2 w-[90%] border-white/80 px-20' />
          <div className='w-full text-center'>
            <h4 className='text-center'>Treasury</h4>
            <p className='text-sm'>{`Distribute Tokens to DAO's Treasury`}</p>
          </div>
          <div className='flex justify-center px-10'>
            <div className='flex'>
              <div className='flex-col'>
                <p className='ml-1 opacity-40'>Recipient Name</p>
                <div className='flex h-12 w-[400px] items-center rounded-[10px] border-[0.3px] bg-base-50 px-2 opacity-40'>
                  Treasury
                </div>
              </div>
              <div className='mx-3 flex flex-col'>
                <p className='ml-1'>Number of Tokens</p>
                <input
                  type='number'
                  placeholder='0'
                  className='input-primary input text-center'
                  {...register('treasuryTokens', {
                    required: 'Required',
                    minLength: { value: 1, message: 'Minimum is 1' },
                    maxLength: { value: 30, message: 'Maximum is 30' },
                  })}
                />
              </div>
              <div className='flex items-center justify-center pt-5'>0%</div>
            </div>
          </div>
        </div>
        <div className='mt-6 flex w-full justify-end'>
          <button className='btn mr-3 w-48' onClick={handleBack} type='button'>
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
    </div>
  );
};

export default IssueTokens;
