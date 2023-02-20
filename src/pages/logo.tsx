import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import MainLayout from '@/templates/MainLayout';

const Logo = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      console.log('reset here');
      reset();
    }
  });

  return (
    <MainLayout
      title='Create a DAO - GenesisDAO'
      description='Create a DAO - GenesisDAO'>
      <div className='container mx-auto mt-12 min-w-[600px] max-w-[820px] px-14 py-5'>
        <div className='flex flex-col items-center gap-y-6'>
          <div>
            <progress
              className='progress progress-primary h-[10px] w-[400px]'
              value='10'
              max='100'></progress>
          </div>
          <div className='text-center'>
            <h2 className='text-primary'>Logo And Design</h2>
            <p className='px-24'>
              {`Add a logo and describe in a short way what your DAO is all about.
            If you don't have a logo yet, just skip that and come back to it once 
            the DAO is set-up.`}
            </p>
          </div>
          <div className='flex w-full items-center px-12'>
            <form onSubmit={handleSubmit(onSubmit)} className='min-w-full'>
              <div className='mb-8 flex flex-col items-center gap-y-8'>
                <div className='min-w-full'>
                  <p className='mb-1 ml-2'>Email</p>
                  <input
                    className='input-primary input'
                    type='text'
                    placeholder='Email '
                    {...register('Email ', {})}
                  />
                </div>
                <div>Upload Logo [form]</div>
                <div className='min-w-full'>
                  <p className='mb-1 ml-2'>Short Overview</p>
                  <textarea
                    className='textarea h-48'
                    {...register('Short Overview', {})}
                  />
                </div>
                <div className='min-w-full'>
                  <p className='mb-1 ml-2'>Long Description</p>
                  <textarea
                    className='textarea h-64'
                    {...register('Long Description', {})}
                  />
                </div>
              </div>
              <div>
                <button className='btn-primary btn w-48' type='submit'>
                  Next
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Logo;
