import { ErrorMessage } from '@hookform/error-message';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import type { LogoFormValues } from '@/stores/genesisStore';
import useGenesisStore from '@/stores/genesisStore';
import upload from '@/svg/upload.svg';

const LogoForm = (props: { daoId: string | null }) => {
  const daos = useGenesisStore((s) => s.daos);
  const dao = daos?.[props.daoId as string];
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<LogoFormValues>();
  const router = useRouter();
  const updateCreateDaoSteps = useGenesisStore((s) => s.updateCreateDaoSteps);

  const onSubmit = (data: any) => {
    console.log(data);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      updateCreateDaoSteps(4);
    }
  });

  const handleSkip = () => {
    router.push(`dao/${props.daoId}`);
  };

  return (
    <div className='flex flex-col items-center gap-y-6 px-12'>
      <div>
        <progress
          className='progress progress-primary h-[10px] w-[400px]'
          value='80'
          max='100'></progress>
      </div>
      <div className='text-center'>
        <h2 className='text-primary'>{dao?.daoName} Logo And Design</h2>
        <p className='px-24'>
          {`Add a logo and describe in a short way what your DAO is all about.
            If you don't have a logo yet, just skip that and come back to it once 
            the DAO is set-up.`}
        </p>
      </div>
      <div className='flex w-full items-center'>
        <form onSubmit={handleSubmit(onSubmit)} className='min-w-full'>
          <div className='mb-8 flex flex-col items-center gap-y-8'>
            <div className='min-w-full'>
              <p className='mb-1 ml-1'>Email</p>
              <input
                className='input-primary input'
                type='text'
                placeholder='Email'
                {...register('email', {
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Entered value does not match email format',
                  },
                })}
              />
              <ErrorMessage
                errors={errors}
                name='email'
                render={({ message }) => (
                  <p className='mt-1 ml-2 text-error'>{message}</p>
                )}
              />
            </div>
            <div className='min-w-full'>
              <p className='mb-1 ml-1'>Upload Logo File</p>
              <div className='file-drop relative h-48'>
                <input
                  className='absolute z-10 h-full w-full cursor-pointer opacity-0'
                  type='file'
                  accept='image/*'
                  id='file'
                  {...register('logoImage', {})}
                />
                <div className='flex flex-col py-6 text-center opacity-80'>
                  <Image
                    className='mx-auto mb-2'
                    src={upload}
                    width={45}
                    height={32}
                    alt='upload'
                  />
                  <p>Drop your image or browse</p>
                  <p className='text-sm'>{`Image size: Recommended {size} x {size}`}</p>
                  <p className='text-sm'>{`File format: .jpg or .png`}</p>
                  <p className='text-sm'>{`File size: max of {size} mb`}</p>
                </div>
              </div>
            </div>
            <div className='min-w-full'>
              <p className='mb-1 ml-1'>Short Overview</p>
              <textarea
                className='textarea h-48'
                {...register('shortOverview', {})}
              />
            </div>
            <div className='min-w-full'>
              <p className='mb-1 ml-2'>Long Description</p>
              <textarea
                className='textarea h-64'
                {...register('longDescription', {})}
              />
            </div>
          </div>
          <div className='flex justify-end'>
            <button className='btn-primary btn mr-3' type='submit'>
              Upload and Sign
            </button>
            <button
              className='btn mr-4 w-48'
              type='button'
              onClick={handleSkip}>
              Skip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogoForm;
