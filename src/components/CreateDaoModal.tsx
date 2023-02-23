import Modal from 'antd/lib/modal';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import useGenesisStore from '@/stores/genesisStore';

const CreateDaoModal = () => {
  const isStartModalOpen = useGenesisStore((s) => s.isStartModalOpen);
  const updateIsStartModalOpen = useGenesisStore(
    (s) => s.updateIsStartModalOpen
  );
  const [confirmLoading, setConfirmLoading] = useState(false);

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

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      updateIsStartModalOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    updateIsStartModalOpen(false);
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
          <div className='flex w-full items-center'>
            <form onSubmit={handleSubmit(onSubmit)} className='min-w-full'>
              <div className='mb-8 flex flex-col items-center gap-y-8'>
                <div className='min-w-full'>
                  <div className='flex items-end justify-between'>
                    <p className='mb-1 ml-2'>DAO Name *</p>
                  </div>
                  <input
                    className='input-primary input'
                    type='text'
                    placeholder='DAO NAME *'
                    {...register('daoName ', {})}
                  />
                </div>
                <div className='min-w-full'>
                  <div className='flex items-end justify-between'>
                    <p className='mb-1 ml-2'>DAO ID *</p>
                    <p className='mb-1 ml-2 text-xs'>
                      Choose from capital A-Z and numbers 0-9(No Space)
                    </p>
                  </div>

                  <input
                    className='input-primary input'
                    type='text'
                    placeholder='DAO ID *'
                    {...register('daoName ', {})}
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
      </Modal>
    </>
  );
};

export default CreateDaoModal;
