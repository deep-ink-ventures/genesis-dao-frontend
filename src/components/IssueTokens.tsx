import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import useGenesisStore from '@/stores/genesisStore';

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
    updateCreateDaoSteps(5);
  };

  const handleNext = () => {
    updateCreateDaoSteps(3);
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
      <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
        <div className='card flex h-[207px] w-full items-center justify-center border-none py-5 hover:brightness-100'>
          <div>
            <p>Number of Tokens To Issue</p>
            <input
              type='number'
              placeholder='0'
              className='input-primary input'
              {...register('tokensToIssue', {
                required: 'Required',
                min: { value: 1, message: 'Minimum is 1' },
              })}
            />
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
