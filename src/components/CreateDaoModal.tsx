import { ErrorMessage } from '@hookform/error-message';
import Modal from 'antd/lib/modal';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import type { CreateDaoData } from '@/stores/genesisStore';
import useGenesisStore from '@/stores/genesisStore';

const CreateDaoModal = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitSuccessful },
  } = useForm<CreateDaoData>();
  // fixme need to query wallet balance
  const [hasTenDots, _setHasTenDots] = useState(true);
  const isStartModalOpen = useGenesisStore((s) => s.isStartModalOpen);
  // const txnProcessing = useGenesisStore((s) => s.txnProcessing);
  // const updateTxnProcessing = useGenesisStore((s) => s.updateTxnProcessing);
  const updateIsStartModalOpen = useGenesisStore(
    (s) => s.updateIsStartModalOpen
  );
  const [confirmLoading, setConfirmLoading] = useState(false);
  const watchName = watch('daoName', '');
  const watchId = watch('daoId', '');

  const onSubmit = (data: any) => {
    // fixme
    setConfirmLoading(true);
    console.log(data);
    setTimeout(() => {
      updateIsStartModalOpen(false);
      setConfirmLoading(false);
      router.push('start');
    }, 2000);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  });

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      updateIsStartModalOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    updateIsStartModalOpen(false);
  };

  const alert = (hasTenDot: boolean) => {
    if (hasTenDot) {
      return (
        <div className='alert alert-info shadow-lg'>
          <div>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              className='h-6 w-6 shrink-0 stroke-current'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'></path>
            </svg>
            <p>
              <span className='font-bold'>{`10 DOT Tokens `}</span>will be
              reserved upon creation of your DAO. The reserved tokens will be
              refunded when the DAO is destroyed.
            </p>
          </div>
        </div>
      );
    }
    return (
      <div className='alert alert-error shadow-lg'>
        <div>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6 shrink-0 stroke-current'
            fill='none'
            viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <p>
            Sorry you need at least{' '}
            <span className='font-bold'>10 DOT tokens</span> to create a DAO.
            You will get them back if you destroy the DAO.
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      <Modal
        open={isStartModalOpen}
        confirmLoading={confirmLoading}
        wrapClassName='a-modal-bg'
        className='a-modal'
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={615}>
        <div className='flex flex-col items-center gap-y-6 px-16'>
          <div className='text-center'>
            <h2 className='text-primary'>{`Let's get started!`}</h2>
            <p className='px-20'>
              {`Please choose DAO NAME and DAO ID wisely. They CANNOT be changed.`}
            </p>
          </div>
          {alert(hasTenDots)}
          <div
            className={`flex w-full items-center ${
              !hasTenDots ? 'text-neutral/30' : null
            }`}>
            <form onSubmit={handleSubmit(onSubmit)} className='min-w-full'>
              <div className='mb-8 flex flex-col items-center gap-y-8'>
                <div className='min-w-full'>
                  <div className='flex items-end justify-between'>
                    <p className='mb-1 ml-2'>
                      DAO Name{' '}
                      <span className='text-lg font-medium text-red-600'>
                        *
                      </span>
                    </p>
                  </div>
                  <div className='relative'>
                    <input
                      className={`input ${
                        watchName.length >= 32 || errors.daoName
                          ? 'input-error'
                          : 'input-primary'
                      }`}
                      type='text'
                      placeholder='DAO NAME *'
                      disabled={!hasTenDots}
                      {...register('daoName', {
                        required: 'Required',
                        maxLength: { value: 32, message: 'Max length is 32' },
                        minLength: { value: 3, message: 'Minimum length is 3' },
                      })}
                    />
                    <ErrorMessage
                      errors={errors}
                      name='daoName'
                      render={({ message }) => (
                        <p className='mt-1 ml-2 text-error'>{message}</p>
                      )}
                    />
                    <p className='absolute top-2 right-2 opacity-60'>
                      {watchName.length}/32
                    </p>
                  </div>
                </div>
                <div className='min-w-full'>
                  <div className='flex items-end justify-between'>
                    <p className='mb-1 ml-2'>
                      DAO ID{' '}
                      <span className='text-lg font-medium text-red-600'>
                        *
                      </span>
                    </p>
                    <p className='mb-1 ml-2 text-sm'>
                      Choose from capital A-Z and numbers 0-9(no space)
                    </p>
                  </div>
                  <div className='relative'>
                    <input
                      className={`input ${
                        watchId.length >= 8 || errors.daoId
                          ? 'input-error'
                          : 'input-primary'
                      }`}
                      type='text'
                      placeholder='DAO ID *'
                      disabled={!hasTenDots}
                      {...register('daoId', {
                        required: 'Required',
                        maxLength: { value: 8, message: 'Max Length is 8' },
                        minLength: { value: 3, message: 'Minimum length is 3' },
                        pattern: {
                          value: /^[A-Z0-9]+$/,
                          message: 'Only capital A-Z or 0-9',
                        },
                      })}
                    />
                    <ErrorMessage
                      errors={errors}
                      name='daoId'
                      render={({ message }) => (
                        <p className='mt-1 ml-2 text-error'>{message}</p>
                      )}
                    />
                    <p
                      className={`absolute top-2 right-2 opacity-60 ${
                        watchId.length >= 8 ? 'text-error' : null
                      }`}>
                      {watchId.length}/8
                    </p>
                  </div>
                </div>
              </div>
              <div className='flex justify-center'>
                <button
                  className={`btn-primary btn w-96 ${
                    confirmLoading ? 'loading' : null
                  }`}
                  type='submit'
                  disabled={!hasTenDots}>
                  Proceed
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateDaoModal;
