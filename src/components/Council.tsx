import Image from 'next/image';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import useGenesisStore from '@/stores/genesisStore';
import plus from '@/svg/plus.svg';
import { truncateMiddle } from '@/utils';

const Council = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm();
  const currentWalletAccount = useGenesisStore((s) => s.currentWalletAccount);
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
    updateCreateDaoSteps(2);
  };

  return (
    <div className='flex flex-col items-center gap-y-5'>
      <div>
        <progress
          className='progress progress-primary h-[10px] w-[400px]'
          value='50'
          max='100'></progress>
      </div>
      <div>
        <h2 className='text-center text-primary'>Add a Council</h2>
      </div>
      <div className='px-24'>
        <p className='text-center'>
          A council can be a valuable addition to the DAO, providing guidance,
          leadership, and expertise. With a council in place, you can ensure
          that the DAO operates with a clear direction and is able to make
          informed decisions.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='card flex h-[386px] w-full flex-col items-center gap-y-5 border-none py-5 hover:brightness-100'>
          <div>
            <h3 className='text-center text-[23px]'>Council Members</h3>
          </div>
          <div className='flex'>
            <div className='mr-3 flex flex-col justify-end pb-3 pl-3'>1</div>
            <div className='flex'>
              <div className='mr-3 flex flex-col'>
                <p className='ml-1'>Your Name</p>
                <input
                  type='text'
                  placeholder='Your name'
                  className='input-primary input'
                  {...register('creatorName', {
                    required: 'Required',
                    minLength: { value: 1, message: 'Minimum is 1' },
                    maxLength: { value: 30, message: 'Maximum is 30' },
                  })}
                />
              </div>
              <div className='flex-col'>
                <p className='ml-1 opacity-40'>Wallet Address</p>
                <div className='flex h-12 w-[400px] items-center rounded-[10px] border-[0.3px] bg-base-50 px-2 opacity-40'>
                  {truncateMiddle(currentWalletAccount?.address)}
                </div>
              </div>
            </div>
          </div>
          <div className='flex'>
            <div className='mr-3 flex flex-col justify-end pb-3 pl-3'>1</div>
            <div className='flex'>
              <div className='mr-3 flex flex-col'>
                <p className='ml-1'>Name</p>
                <input
                  type='text'
                  placeholder='Your name'
                  className='input-primary input'
                  {...register('name2', {
                    required: 'Required',
                    minLength: { value: 1, message: 'Minimum is 1' },
                    maxLength: { value: 30, message: 'Maximum is 30' },
                  })}
                />
              </div>
              <div className='w-[400px] flex-col'>
                <p className='ml-1'>Wallet Address</p>
                <input
                  type='text'
                  placeholder='Wallet Address'
                  className='input-primary input text-xs'
                  {...register('wallet2', {
                    required: 'Required',
                    minLength: { value: 1, message: 'Minimum is 1' },
                    maxLength: { value: 30, message: 'Maximum is 30' },
                  })}
                />
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
              Add a Member
            </button>
          </div>
        </div>
        <div className='card mt-6 flex h-[292px] w-full flex-col items-center gap-y-5 border-none py-5 hover:brightness-100'>
          <div>
            <h3 className='text-center text-[23px]'>Approval Threshold</h3>
          </div>
          <div className='px-24 text-center'>
            <p>
              The signing threshold is a defined level of consensus that must be
              reached in order for proposals to be approved and implemented.
            </p>
          </div>
          <div className='w-[100px]'>
            <input
              className='input-primary input text-center'
              type='number'
              placeholder='0'
              {...register('councilThreshold', {
                required: 'Required',
                min: { value: 1, message: 'Minimum is 1' },
              })}
            />
          </div>
          <p>
            Out of <span className='text-primary'>2</span> Council Member(s)
          </p>
        </div>
        <div className='mt-6 flex w-full justify-end'>
          <button className='btn mr-3 w-48' onClick={handleBack} type='button'>
            Back
          </button>
          <button className='btn-primary btn w-48' type='submit'>
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default Council;
